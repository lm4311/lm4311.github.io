// Makes the web media for the iWasThere page from the user's full run-through recording and the team's level map.
//
//   node scripts/iwasthere-media.cjs            (everything)
//   ONLY=chase,coral node scripts/iwasthere-media.cjs   (just these clips, or "stills")
//   ONLY=full node scripts/iwasthere-media.cjs          (the whole run-through; not on the site any more, see below)
//
// Run-through: only when asked for with ONLY=full (the page shows the YouTube trailer instead, and the 92 MB file was
//              removed from the site). The whole 11:48 recording with sound, 1280 px H.264 + AAC with faststart, two-pass to stay well under
//              GitHub's 100 MB file limit: public/media/iwasthere/playthrough.mp4 (+ playthrough.jpg poster).
// Clips:       silent 1280 px H.264 loops, one per gameplay beat in play order, each with a JPG poster.
//              chase.mp4 is also the homepage card loop.
// Stills:      cover.webp (the shipwreck shot just before the credits, for the card) in public/media/iwasthere/, and the level-design map
//              (posted by Winsey Wu in the team Discord, 30 Jan 2026) in src/assets/work/iwasthere/.
// Needs ffmpeg with libx264: on the PATH, or set FFMPEG to the full path of ffmpeg.exe.
// Sources (not changed): SOURCE below (3840x2088, 30 fps), and MAP.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SOURCE = process.env.SOURCE || 'C:/Users/Luke/Downloads/iWasThere Gameplay Demo.mp4';
const MAP = process.env.MAP; // the level map PNG from Discord (2026-01-30, #resources)
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const want = (name) => !ONLY || ONLY.includes(name);

// [name, start s, length s, poster s], in play order.
const CLIPS = [
  ['menu', 2, 12, 8],
  ['dive-in', 22, 25, 34],
  ['tutorial', 96, 22, 102],
  ['flashlight', 144, 16, 157],
  ['gallery', 160, 20, 174],
  ['camera', 196, 22, 210],
  ['coral', 252, 22, 260],
  ['clownfish-photo', 335, 7, 336],
  ['game-over', 346, 18, 355],
  ['chase', 400, 30, 406],
  ['photo-hunt', 446, 32, 468],
  ['last-spot', 626, 18, 632],
];

const mediaDir = path.join(ROOT, 'public', 'media', 'iwasthere');
const imgDir = path.join(ROOT, 'src', 'assets', 'work', 'iwasthere');
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const run = (args) => execFileSync(FFMPEG, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

async function poster(at, out, width) {
  const png = path.join(os.tmpdir(), `iwasthere-poster-${process.pid}.png`);
  run(['-ss', String(at), '-i', SOURCE, '-frames:v', '1', png]);
  const img = sharp(png).resize({ width });
  await (out.endsWith('.webp') ? img.webp({ quality: 82 }) : img.jpeg({ quality: 80, mozjpeg: true })).toFile(out);
  fs.unlinkSync(png);
}

(async () => {
  for (const d of [mediaDir, imgDir]) fs.mkdirSync(d, { recursive: true });

  if (want('stills')) {
    await poster(673.6, path.join(mediaDir, 'cover.webp'), 1600); // the shipwreck, just before the credits
    console.log(`cover.webp: ${kb(fs.statSync(path.join(mediaDir, 'cover.webp')).size)}`);
    if (MAP) {
      // The screenshot (687x749) holds two maps over a dark background, stacked with an empty corner. Cut each one
      // out and set them side by side at their own size, tutorial first (play order): level-map.webp.
      const cut = async (box) => sharp(await sharp(MAP).extract(box).toBuffer()).trim({ threshold: 30 }).toBuffer({ resolveWithObject: true });
      const tut = await cut({ left: 55, top: 330, width: 240, height: 400 });
      const mid = await cut({ left: 55, top: 15, width: 580, height: 325 });
      const pad = 16;
      const width = pad * 3 + tut.info.width + mid.info.width;
      const height = pad * 2 + Math.max(tut.info.height, mid.info.height);
      const out = path.join(imgDir, 'level-map.webp');
      await sharp({ create: { width, height, channels: 3, background: '#1c1c1c' } })
        .composite([
          { input: tut.data, left: pad, top: Math.round((height - tut.info.height) / 2) },
          { input: mid.data, left: pad * 2 + tut.info.width, top: Math.round((height - mid.info.height) / 2) },
        ])
        .webp({ quality: 92, effort: 6 })
        .toFile(out);
      console.log(`level-map.webp: ${width}x${height} ${kb(fs.statSync(out).size)}`);
    }
  }

  for (const [name, start, len, at] of CLIPS) {
    if (!want(name)) continue;
    const out = path.join(mediaDir, name + '.mp4');
    run([
      '-ss', String(start), '-t', String(len), '-i', SOURCE, '-map', '0:v:0', '-an',
      '-vf', 'scale=1280:-2:flags=lanczos,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-profile:v', 'high', '-movflags', '+faststart', out,
    ]);
    const jpg = path.join(mediaDir, name + '.jpg');
    await poster(at, jpg, 1280);
    console.log(`${name}.mp4: ${kb(fs.statSync(out).size)}, poster ${kb(fs.statSync(jpg).size)}`);
  }

  if (ONLY && ONLY.includes('full')) {
    // ~1.0 Mb/s video + 96 kb/s audio over 708 s: about 95 MB.
    const out = path.join(mediaDir, 'playthrough.mp4');
    const log = path.join(os.tmpdir(), `iwasthere-2pass-${process.pid}`);
    const v = ['-vf', 'scale=1280:-2:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-b:v', '980k',
      '-maxrate', '2500k', '-bufsize', '5000k', '-profile:v', 'high', '-passlogfile', log];
    run(['-i', SOURCE, ...v, '-pass', '1', '-an', '-f', 'mp4', os.devNull === '\\.\nul' ? 'NUL' : os.devNull]);
    run(['-i', SOURCE, ...v, '-pass', '2', '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-movflags', '+faststart', out]);
    for (const f of fs.readdirSync(os.tmpdir())) if (f.startsWith(path.basename(log))) fs.rmSync(path.join(os.tmpdir(), f));
    await poster(8, path.join(mediaDir, 'playthrough.jpg'), 1280);
    console.log(`playthrough.mp4: ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);
  }
})();
