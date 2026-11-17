// Migrates the Last Sonata (UE5 zombie survival FPS) media from the old portfolio site (Game1.html) and makes web versions.
//
//   node scripts/last-sonata-media.cjs
//
// Stills:  WebP masters (2560 px wide at most) in src/assets/work/last-sonata/; Astro makes the AVIF/WebP sizes the
//          page serves. The boss still is also written as public/media/last-sonata/cover.webp for the project card.
// Clips:   silent 720p H.264 MP4 loops with faststart in public/media/last-sonata/, plus a JPG poster each, one per
//          gameplay beat of the demo reel, in reel order. Most are cut from the demo reel itself (YouTube Studio
//          download, 720p); combat and horde come from the old site's 1080p gameplay loop, which has the same
//          footage at a higher quality. combat.mp4 is also the homepage card loop.
// PDF:     the design and systems analysis, copied unchanged (already 120 KB) to public/docs/.
// Needs ffmpeg with libx264: on the PATH, or set FFMPEG to the full path of ffmpeg.exe.
// Sources (not changed): C:\Users\Luke\Desktop\WixSite\IMAGE, \VIDEO and \DOCUMENT, and the demo reel
// (https://youtu.be/E8vpLoMMr3w) at REEL below.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const OLD = 'C:/Users/Luke/Desktop/WixSite';
const ROOT = path.join(__dirname, '..');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SOURCES = {
  loop: `${OLD}/VIDEO/Last Sonata Background Video.mp4`,
  reel: process.env.REEL || 'C:/Users/Luke/Downloads/Last Sonata Demo Reel.mp4',
};

const STILLS = [
  // [old file, new name]
  ['IMAGE/game4-poster.jpg', 'boss'],
  ['IMAGE/game4-img1.jpeg', 'piano-room'],
];

// [name, source, start s, length s, poster s]. Times in the reel are noted for the clips cut from the loop.
const CLIPS = [
  ['arrival', 'reel', 0, 16, 10],
  ['house-search', 'reel', 20, 16, 30],
  ['house-infected', 'reel', 41, 10, 44.6],
  ['piano', 'reel', 83, 16, 88],
  ['door-key', 'reel', 108, 15, 120],
  ['journal', 'reel', 126, 18, 131],
  ['death-letter', 'reel', 193, 15, 197],
  ['village', 'reel', 212, 16, 216],
  ['dial-code', 'reel', 238, 18, 240.5],
  ['combat', 'loop', 0, 15, 3], // reel 4:20
  ['horde', 'loop', 33, 15, 35.3], // reel 4:53
  ['butcher', 'reel', 309, 14, 312],
  ['bearman', 'reel', 336, 16, 350.5],
  ['dragon', 'reel', 366, 19, 374],
];

const imgDir = path.join(ROOT, 'src', 'assets', 'work', 'last-sonata');
const mediaDir = path.join(ROOT, 'public', 'media', 'last-sonata');
const docsDir = path.join(ROOT, 'public', 'docs');
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

(async () => {
  for (const d of [imgDir, mediaDir, docsDir]) fs.mkdirSync(d, { recursive: true });

  for (const [file, name] of STILLS) {
    const src = `${OLD}/${file}`;
    const out = path.join(imgDir, name + '.webp');
    const meta = await sharp(src).metadata();
    await sharp(src).rotate().resize({ width: 2560, withoutEnlargement: true }).webp({ quality: 92, effort: 6 }).toFile(out);
    const o = await sharp(out).metadata();
    console.log(`${name}: ${meta.width}x${meta.height} ${kb(fs.statSync(src).size)} -> ${o.width}x${o.height} ${kb(fs.statSync(out).size)}`);
  }

  // Card poster (the card shows it until hover).
  const cover = path.join(mediaDir, 'cover.webp');
  await sharp(`${OLD}/IMAGE/game4-poster.jpg`).resize({ width: 1600 }).webp({ quality: 82 }).toFile(cover);
  console.log(`cover.webp: ${kb(fs.statSync(cover).size)}`);

  for (const [name, source, start, len, at] of CLIPS) {
    const src = SOURCES[source];
    const out = path.join(mediaDir, name + '.mp4');
    execFileSync(FFMPEG, [
      '-v', 'error', '-y', '-ss', String(start), '-t', String(len), '-i', src, '-map', '0:v:0', '-an',
      '-vf', "scale='min(1280,iw)':-2:flags=lanczos,format=yuv420p",
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-profile:v', 'high', '-movflags', '+faststart', out,
    ]);
    const png = path.join(os.tmpdir(), `last-sonata-poster-${process.pid}.png`);
    execFileSync(FFMPEG, ['-v', 'error', '-y', '-ss', String(at), '-i', src, '-frames:v', '1', png]);
    const jpg = path.join(mediaDir, name + '.jpg');
    await sharp(png).resize({ width: 1280 }).jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
    fs.unlinkSync(png);
    console.log(`${name}.mp4: ${kb(fs.statSync(out).size)}, poster ${kb(fs.statSync(jpg).size)}`);
  }

  const pdf = path.join(docsDir, 'last-sonata-design-and-analysis.pdf');
  fs.copyFileSync(`${OLD}/DOCUMENT/Last Sonata - Design and Analysis.pdf`, pdf);
  console.log(`PDF: ${kb(fs.statSync(pdf).size)}`);
})();
