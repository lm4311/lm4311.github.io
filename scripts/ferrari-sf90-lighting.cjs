// Pairs frames of the SF90 film with their lighting-only (clay) render for the Ferrari page's lighting study,
// and writes src/data/ferrari-sf90-lighting.ts.
//
//   node scripts/ferrari-sf90-lighting.cjs
//
// Needs ffmpeg: on the PATH, or set FFMPEG to the full path of ffmpeg.exe.
// Sources (not changed):
//   D:\ferrari commercial project\SF90Commercial4K-ProRes.mov                       the film
//   D:\ferrari_studio_repo 5.8\Saved\MovieRenders\Clay_LightingOnly\                clay frames, one folder per shot
//   ...\Clay_LightingOnly\_Film\edit_list.json                                      film frame -> shot and clay frame
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const MASTER = 'D:/ferrari commercial project/SF90Commercial4K-ProRes.mov';
const CLAY = 'D:/ferrari_studio_repo 5.8/Saved/MovieRenders/Clay_LightingOnly';
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.join(__dirname, '..', 'src', 'assets', 'work', 'ferrari-sf90', 'lighting');
const DATA = path.join(__dirname, '..', 'src', 'data', 'ferrari-sf90-lighting.ts');
const W = 1920, H = 802; // the 2.39:1 picture inside the 1080p letterbox
const QUALITY = 93;
const SEARCH = 8; // clay frames either side of the edit list's frame to try
const MIN_MATCH = 0.33; // below this the clay frame does not show the same picture, so the pair is left out

// [group, seconds into the film, file name, title]. The first pair of each group is shown full width.
const PAIRS = [
  ['studio', 30.5, 'profile', 'Profile'],
  ['studio', 3.5, 'headlights', 'Headlights in the dark'],
  ['studio', 5.5, 'rim-light', 'Rim light'],
  ['studio', 8.5, 'red-backlight', 'Red backlight'],
  ['studio', 9.5, 'headlight', 'Headlight'],
  ['studio', 11.5, 'three-quarter', 'Front three-quarter'],
  ['studio', 13.5, 'side-intake', 'Side intake'],
  ['studio', 15.5, 'nose', 'Nose and lower grille'],
  ['studio', 17.5, 'fender-shield', 'Fender shield'],
  ['studio', 21.5, 'tail-lights', 'Tail lights'],
  ['studio', 23.5, 'rear', 'Rear'],
  ['studio', 26.0, 'engine-cover', 'Engine cover from above'],
  ['studio', 28.0, 'wheel-hub', 'Wheel hub and brake disc'],
  // Driving shots are limited to the ones where the clay frame lines up with the film. Left out: shots with camera
  // shake (random on every render), the tunnel wheel close-ups (reframed since the final render) and the launch.
  ['driving', 44.0, 'front', 'Front'],
  ['driving', 34.5, 'rear-deck', 'Rear deck'],
  ['driving', 50.0, 'highway-aerial', 'Highway from the air'],
  ['driving', 59.0, 'tunnel', 'Tunnel'],
  ['driving', 60.4, 'chase', 'Chase'],
  ['driving', 64.6, 'curve', 'Through the curve'],
  ['driving', 79.0, 'into-the-sun', 'Into the sun'],
  ['driving', 82.5, 'bridge', 'The bridge'],
  ['driving', 87.0, 'aerial-tracking', 'Aerial tracking'],
  ['driving', 89.5, 'rear-chase', 'Rear chase'],
  ['driving', 91.5, 'wheel-and-sun', 'Wheel and sun'],
];
// Pairs kept even though the automatic check scores them low (the clay is too dark to compare outlines); checked by eye.
const FORCE = new Set(['driving-bridge']);
const SKIP = new Set((process.env.SKIP || '').split(',').filter(Boolean));

const edl = JSON.parse(fs.readFileSync(path.join(CLAY, '_Film', 'edit_list.json'), 'utf8'));

function filmFrame(f) {
  const png = path.join(os.tmpdir(), 'sf90-light-' + process.pid + '.png');
  execFileSync(FFMPEG, ['-v', 'error', '-y', '-ss', ((f - 0.5) / 24).toFixed(5), '-i', MASTER, '-frames:v', '1', '-vf', `crop=3840:1604:0:278,scale=${W}:${H}:flags=lanczos`, png]);
  const data = fs.readFileSync(png);
  fs.unlinkSync(png);
  return data;
}

// Edge picture of an image, as a zero-mean unit vector: clay and final differ in shading but share outlines.
async function edges(input) {
  const w = 160, h = 67;
  const g = await sharp(input).resize(w, h, { fit: 'fill' }).greyscale().raw().toBuffer();
  const e = new Float32Array(w * h);
  let mean = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    const m = Math.hypot(g[i + 1] - g[i - 1], g[i + w] - g[i - w]);
    e[i] = m; mean += m;
  }
  mean /= e.length;
  let ss = 0;
  for (let i = 0; i < e.length; i++) { e[i] -= mean; ss += e[i] * e[i]; }
  const n = Math.sqrt(ss) || 1;
  for (let i = 0; i < e.length; i++) e[i] /= n;
  return e;
}
const dot = (a, b) => { let c = 0; for (let i = 0; i < a.length; i++) c += a[i] * b[i]; return c; };

(async () => {
  const groups = {};
  for (const [group, seconds, file, title] of PAIRS) {
    const name = `${group}-${file}`;
    if (SKIP.has(name)) continue;
    const f = Math.round(seconds * 24);
    const e = edl.find((x) => f >= x.start && f <= x.end);
    if (!e) { console.log(name.padEnd(30), 'no clay for this part of the film'); continue; }
    const dir = path.join(CLAY, e.clay);
    const files = fs.readdirSync(dir).filter((x) => x.endsWith('.png')).sort();
    const guess = Math.max(0, Math.min(files.length - 1, e.last !== undefined ? Math.round(e.first + ((f - e.start) * (e.last - e.first)) / Math.max(1, e.end - e.start)) : e.first + (f - e.start)));
    const film = filmFrame(f);
    const fe = await edges(film);
    // Shots matched frame-for-frame to the final render use the edit list's frame; the others search around it.
    const exact = /frame-matched/.test(e.match);
    let best = { j: guess, c: -2 };
    for (let j = exact ? guess : Math.max(0, guess - SEARCH); j <= (exact ? guess : Math.min(files.length - 1, guess + SEARCH)); j++) {
      const clay = await sharp(path.join(dir, files[j])).extract({ left: 0, top: 139, width: W, height: H }).toBuffer();
      const c = dot(fe, await edges(clay));
      if (c > best.c) best = { j, c };
    }
    const keep = best.c >= MIN_MATCH || FORCE.has(name);
    console.log(name.padEnd(30), `${e.clay} frame ${best.j} (edit list ${guess})  match ${best.c.toFixed(2)}  ${keep ? '' : 'LEFT OUT'}`);
    if (!keep) continue;
    for (const side of ['final', 'clay']) fs.mkdirSync(path.join(OUT, side), { recursive: true });
    await sharp(film).webp({ quality: QUALITY, effort: 6 }).toFile(path.join(OUT, 'final', name + '.webp'));
    await sharp(path.join(dir, files[best.j])).extract({ left: 0, top: 139, width: W, height: H }).webp({ quality: QUALITY, effort: 6 }).toFile(path.join(OUT, 'clay', name + '.webp'));
    (groups[group] = groups[group] || []).push({ file: name, title });
  }
  const lines = [
    '// Lighting-study pairs for the Ferrari SF90 page. Written by scripts/ferrari-sf90-lighting.cjs; edit that script, not this file.',
    '// `file` is an image in src/assets/work/ferrari-sf90/lighting/clay/ and .../final/ without its extension.',
    "import type { ImageItem } from './private-jet';",
    '',
  ];
  for (const [g, items] of Object.entries(groups)) lines.push(`export const ${g}Lighting: ImageItem[] = ${JSON.stringify(items, null, 2)};`, '');
  fs.writeFileSync(DATA, lines.join('\n'));
  console.log(Object.entries(groups).map(([g, i]) => `${g}: ${i.length} pairs`).join(', '));
})().catch((e) => { console.error(e.message); process.exit(1); });
