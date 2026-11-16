// Takes stills from the SF90 film's 4K master for the Ferrari SF90 page, and writes src/data/ferrari-sf90.ts.
// Astro makes the sizes the site actually serves (AVIF/WebP, several widths) from these masters at build time.
//
//   node scripts/ferrari-sf90-images.cjs
//
// Needs ffmpeg: on the PATH, or set FFMPEG to the full path of ffmpeg.exe.
// Source (not changed): D:\ferrari commercial project\SF90Commercial4K-ProRes.mov
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const MASTER = 'D:/ferrari commercial project/SF90Commercial4K-ProRes.mov';
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.join(__dirname, '..', 'src', 'assets', 'work', 'ferrari-sf90');
const COVER = path.join(__dirname, '..', 'public', 'media', 'ferrari-sf90', 'cover.webp');
const DATA = path.join(__dirname, '..', 'src', 'data', 'ferrari-sf90.ts');
const CROP = 'crop=3840:1604:0:278'; // the picture inside the letterbox (2.39:1)
const WIDTH = 2560;
const QUALITY = 95; // dark gradients band easily, so the masters stay near lossless
const COVER_AT = 30.5; // homepage card: the studio profile, with the letterbox kept so it fills 16:9

// [seconds into the film, file name, title, note]. The first still of each group is shown full width.
const GROUPS = [
  ['studio', 'Studio reveal', [
    [30.5, '01-profile', 'Profile', 'The full car, at the end of the reveal'],
    [3.5, '02-headlights', 'Headlights in the dark', 'The opening shot'],
    [5.5, '03-rim-light', 'Rim light', 'Roofline and its reflection in the floor'],
    [8.5, '04-red-backlight', 'Red backlight'],
    [9.5, '05-headlight', 'Headlight'],
    [11.5, '06-three-quarter', 'Front three-quarter'],
    [13.5, '07-side-intake', 'Side intake'],
    [15.5, '08-nose', 'Nose and lower grille'],
    [17.5, '09-fender-shield', 'Fender shield'],
    [21.5, '10-tail-lights', 'Tail lights'],
    [23.5, '11-rear', 'Rear'],
    [26.0, '12-engine-cover', 'Engine cover from above'],
    [28.0, '13-wheel-hub', 'Wheel hub and brake disc'],
  ]],
  ['dusk', 'Dusk', [
    [39.0, '01-mirror-and-shield', 'Mirror and fender shield'],
    [34.5, '02-rear-deck', 'Rear deck'],
    [38.5, '03-driver', 'The driver arrives'],
    [40.9, '04-engine-badge', 'SF90 Stradale badge'],
    [42.0, '05-visor', 'Visor'],
    [44.0, '06-front', 'Front'],
    [45.4, '07-cockpit', 'Cockpit', 'Instrument cluster and steering wheel'],
    [46.5, '08-roof-reflection', 'Sky in the roof'],
    [48.0, '09-canopy', 'Canopy'],
    [50.0, '10-highway-aerial', 'Highway from the air'],
    [53.5, '11-side-pass', 'Side pass'],
    [55.5, '12-helmet', 'Helmet'],
  ]],
  ['tunnel', 'Tunnel', [
    [69.0, '01-launch', 'Launch', 'Tyre smoke'],
    [59.0, '02-tunnel', 'Tunnel'],
    [60.4, '03-chase', 'Chase'],
    [63.5, '04-low-front', 'Low front'],
    [64.6, '05-curve', 'Through the curve'],
    [75.0, '06-wheel', 'Wheel at speed'],
    [76.0, '07-caliper', 'Brake caliper'],
  ]],
  ['bridge', 'Bridge', [
    [82.5, '01-bridge', 'The bridge'],
    [79.0, '02-into-the-sun', 'Into the sun'],
    [80.5, '03-front-three-quarter', 'Front three-quarter'],
    [87.0, '04-aerial-tracking', 'Aerial tracking'],
    [89.5, '05-rear-chase', 'Rear chase'],
    [91.5, '06-wheel-and-sun', 'Wheel and sun'],
    [93.0, '07-front', 'Front'],
    [94.5, '08-through-the-cables', 'Through the cables'],
    [96.5, '09-golden-side', 'Side, low sun'],
    [98.0, '10-crossing', 'Crossing'],
  ]],
  ['titles', 'End titles', [
    [100.5, '01-sf90-stradale', 'SF90 Stradale title'],
    [106.0, '02-prancing-horse', 'Prancing horse'],
  ]],
];

// One frame as PNG, straight from the master.
function frame(seconds, filter) {
  const png = path.join(os.tmpdir(), 'sf90-frame-' + process.pid + '.png');
  const args = ['-v', 'error', '-y', '-ss', String(seconds), '-i', MASTER, '-frames:v', '1'];
  if (filter) args.push('-vf', filter);
  execFileSync(FFMPEG, [...args, png]);
  const data = fs.readFileSync(png);
  fs.unlinkSync(png);
  return data;
}

(async () => {
  if (!fs.existsSync(MASTER)) throw new Error('Master not found: ' + MASTER);
  const groups = [];
  let bytes = 0;
  for (const [dir, title, stills] of GROUPS) {
    const folder = path.join(OUT, dir);
    fs.mkdirSync(folder, { recursive: true });
    const items = [];
    for (const [seconds, file, name, note] of stills) {
      const target = path.join(folder, file + '.webp');
      await sharp(frame(seconds, CROP)).resize({ width: WIDTH, kernel: 'lanczos3' }).webp({ quality: QUALITY, effort: 6 }).toFile(target);
      bytes += fs.statSync(target).size;
      items.push(note ? { file, title: name, note } : { file, title: name });
    }
    groups.push({ dir, title, items });
    console.log(title + ': ' + items.length + ' stills');
  }

  fs.mkdirSync(path.dirname(COVER), { recursive: true });
  await sharp(frame(COVER_AT)).resize({ width: 1920 }).webp({ quality: 90, effort: 6 }).toFile(COVER);

  const lines = [
    '// Still lists for the Ferrari SF90 page. Written by scripts/ferrari-sf90-images.cjs; edit that script, not this file.',
    '// `file` is an image in src/assets/work/ferrari-sf90/<dir>/ without its extension.',
    "import type { ImageItem } from './private-jet';",
    '',
  ];
  for (const g of groups) lines.push('export const ' + g.dir + ': ImageItem[] = ' + JSON.stringify(g.items, null, 2) + ';', '');
  fs.writeFileSync(DATA, lines.join('\n'));
  console.log('Masters: ' + (bytes / 1e6).toFixed(1) + ' MB. Cover: ' + (fs.statSync(COVER).size / 1e3).toFixed(0) + ' KB');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
