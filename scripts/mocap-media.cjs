// Migrates the images and videos of the two motion-capture case studies from the old portfolio site
// (Oath and Shadow, Off Track Ronins) and makes web versions of them. Writes the lists the pages use to
// src/data/oath-and-shadow.ts and src/data/off-track-ronins.ts.
//
//   node scripts/mocap-media.cjs [oath-and-shadow|off-track-ronins] [--images-only]
//
// Images: WebP masters (2560 px wide at most) in src/assets/work/<project>/; Astro makes the AVIF/WebP sizes
//         the site serves. Videos: H.264 MP4 with faststart in public/media/<project>/, plus a WebP poster each.
// Needs ffmpeg: on the PATH, or set FFMPEG to the full path of ffmpeg.exe.
// Sources (not changed): C:\Users\Luke\Desktop\WixSite\IMAGE and \VIDEO (pages Cinematic1.html, Cinematic2.html)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const OLD = 'C:/Users/Luke/Desktop/WixSite';
const ROOT = path.join(__dirname, '..');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const MAX_W = 2560;

// Video kinds: `camera` = filmed footage, `screen` = editor recordings (kept larger so the UI stays readable),
// `loop` = silent cinematic loop for the homepage card. A clip can override `crf` (noisy footage such as fire).
const KIND = {
  camera: { width: 1280, crf: 25 },
  screen: { width: 1600, crf: 26 },
  loop: { width: 1280, crf: 26 },
};

// [old file, title, options]. The first image of each week is shown full width (it was the week's cover).
// Captions are the old site's; covers that had no caption get a plain description of what they show.
const PROJECTS = {
  'oath-and-shadow': {
    card: { video: 'Portfolio Hero Background Video.mp4', poster: 18.7 },
    weeks: {
      week1: {
        images: [
          ['Cinematic1-poster.png', 'Sword-fight capture session on the OptiTrack stage'],
          ['Storyboard.jpg', 'Sword fight storyboard'],
        ],
        clips: [
          ['Execution-Scene.mp4', 'Motion capture behind the scenes: execution scene', { kind: 'camera', poster: 18 }],
          ['Last-Fight-Scene.mp4', 'Motion capture behind the scenes: last fight', { kind: 'camera', poster: 18.7 }],
          ['Sword-Fight-Practice.mp4', 'Motion capture behind the scenes: sword-fight practice', { kind: 'camera', poster: 15.5 }],
          ['Louis-Walk.mp4', 'Motion capture behind the scenes: walk cycle', { kind: 'camera', poster: 20.1 }],
        ],
      },
      week2: {
        images: [['Cinematic1-poster2.png', 'MotionBuilder to Unreal Engine 5 over Live Link']],
        clips: [['Screen-Recording.mp4', 'Live Link real-time streaming test', { kind: 'screen', poster: 21.5 }]],
      },
      week3: {
        images: [
          ['Cinematic1-poster3.png', 'Two-character setup in MotionBuilder and Unreal Engine 5'],
          ['Cinematic1-gallery1.png', 'CG character Blueprint'],
          ['Cinematic1-gallery2.png', 'MotionBuilder: two-character scene setup'],
          ['Cinematic1-gallery3.png', 'MotionBuilder to Unreal Engine Live Link'],
        ],
        clips: [['Screen-Recording2.mp4', 'Sword fight mocap over Live Link', { kind: 'screen', poster: 4.2 }]],
      },
      week4: {
        images: [
          ['Cinematic1-gallery16.png', 'UE5: keyframing camera movement and manual focus distance in each sequencer'],
          ['Cinematic1-gallery4.png', 'MotionBuilder: sword attachment (parent/child constraint)'],
          ['Cinematic1-gallery5.png', 'MotionBuilder: F-curve noise filtering'],
          ['Cinematic1-gallery6.png', 'MotionBuilder: take selection and baking before export'],
          ['Cinematic1-gallery7.png', 'UE5: Control Rig created in the Level Sequencer'],
          ['Cinematic1-gallery8.png', 'UE5: keyframe deletion to remove major noise and jitter'],
          ['Cinematic1-gallery9.png', 'UE5: additive layer to adjust animation creatively and precisely'],
          ['Cinematic1-gallery10.png', 'MetaHuman Creator: customizing the Assassin’s head'],
          ['Cinematic1-gallery11.png', 'MetaHuman Creator: customizing the Knight’s head'],
          ['Cinematic1-gallery12.png', 'UE5: final heads for both characters'],
          ['Cinematic1-gallery13.png', 'UE5: raw and fine-tuned mocap animations'],
          ['Cinematic1-gallery14.png', 'UE5: Control Rig Level Sequencer for each mocap scene'],
          ['Cinematic1-gallery15.png', 'UE5: all Level Sequencers created for the final render'],
          ['Cinematic1-gallery17.png', 'UE5: composition of the master sequencer'],
        ],
        clips: [],
      },
    },
  },
  'off-track-ronins': {
    card: { video: 'Ronin Video Loop.mp4', poster: 2.6 },
    weeks: {
      week1: {
        images: [
          ['Cinematic2-gallery1.png', 'Samurai world, perspective 1'],
          ['Cinematic2-gallery2.png', 'Samurai world, perspective 2'],
          ['Cinematic2-gallery3.png', 'Samurai world, perspective 3'],
          ['Cinematic2-gallery4.png', 'Samurai world, perspective 4'],
          ['Cinematic2-gallery5.png', 'Samurai world, perspective 5'],
          ['Cinematic2-gallery6.png', 'Samurai world, perspective 6'],
          ['Cinematic2-gallery7.png', 'Samurai world, perspective 7'],
          ['Cinematic2-gallery8.png', 'Samurai world, perspective 8'],
          ['Cinematic2-gallery9.png', 'Samurai world, perspective 9'],
        ],
        clips: [['Screen Recording3.mp4', 'Samurai world walkthrough', { kind: 'camera', crf: 28, poster: 8.9 }]],
      },
      week2: {
        images: [['Cinematic2-poster.jpg', 'Combat choreography rehearsal with prop katanas']],
        clips: [['Mocap Practice.mp4', 'Motion capture previsualization', { kind: 'camera', crf: 27, poster: 65.7 }]],
      },
      week3: {
        images: [
          ['Cinematic2-gallery10.png', 'IK Retargeter: OptiTrack skeleton to Samurai'],
          ['Cinematic2-gallery11.png', 'IK Retargeter: OptiTrack skeleton to UE5 Manny'],
          ['Cinematic2-gallery12.png', 'Animation Blueprint: retarget pose from mesh with the IK Retargeter'],
          ['Cinematic2-gallery13.png', 'Animation Blueprint: Live Link pose from Motive to UE5 for the OptiTrack skeleton'],
          ['Cinematic2-gallery14.png', 'Samurai Blueprint: source-to-target Live Link from Motive to UE5'],
          ['Cinematic2-gallery15.png', 'MetaHuman Blueprint: source-to-target Live Link from Motive to UE5'],
          ['Cinematic2-gallery16.JPG', 'Troubleshooting and adjusting the IK Retargeter on set'],
        ],
        clips: [['Cinematic2-video.mp4', 'Short demo of the modular Live Link setup for different skeletons', { kind: 'screen', poster: 5 }]],
      },
      week4: {
        images: [
          ['Cinematic2-poster2.jpg', 'Sword fight on the capture stage, previewed live in Unreal Engine'],
          ['Cinematic2-gallery17.JPG', 'Performance capture with the Unreal Engine preview on the LED wall'],
          ['Cinematic2-gallery18.jpg', 'Performance capture blockout'],
          ['Cinematic2-gallery19.JPG', 'Performance capture stunt'],
          ['Cinematic2-gallery20.jpeg', 'Performance capture team photo'],
        ],
        clips: [
          ['Cinematic2-Video3.mp4', 'Real-time previsualization from Motive to UE5 (rigid body and skeleton)', { kind: 'camera', poster: 8.6 }],
          ['Cinematic2-video2.mp4', 'Performance capture behind the scenes', { kind: 'camera', poster: 3.6 }],
          ['Final Mocap Time Lapse WO.mp4', 'Performance capture timelapse', { kind: 'camera', poster: 19.9 }],
        ],
      },
      week5: {
        images: [
          ['Cinematic2-gallery22.png', 'Dual-skeleton retargeting and rigid-body integration in MotionBuilder'],
          ['Cinematic2-gallery21.png', 'Mocap take preview and selection in UE5'],
          ['Cinematic2-gallery23.png', 'Mocap refinement through an FK/IK Control Rig workflow for precise blade contact'],
          ['Cinematic2-gallery24.png', 'Raw and refined mocap animations (scenes 01–12)'],
          ['Cinematic2-gallery25.png', 'Raw and refined mocap animations (scenes 13–29)'],
          ['Cinematic2-gallery26.png', 'Control Rig setup for each mocap scene'],
          ['Cinematic2-gallery27.png', 'Level Sequencer setup for each mocap scene'],
        ],
        clips: [['Cinematic2-video4.mp4', 'Cinematic camera configuration and shot direction through Sequencer camera cuts', { kind: 'screen', poster: 7.3 }]],
      },
      week6: {
        images: [
          ['Cinematic2-poster3.jpg', 'LED volume shoot for the office scenes'],
          ['Cinematic2-gallery28.png', 'Final compositing of SFX, VFX and CGI with live-action footage in DaVinci Resolve'],
        ],
        clips: [
          ['Cinematic2-video6.mp4', 'LED volume virtual production (ICVFX) with camera tracking', { kind: 'camera', poster: 6.7 }],
          ['Cinematic2-video5.mp4', 'LED volume behind the scenes', { kind: 'camera', poster: 3.8 }],
          ['Cinematic2-video7.mp4', 'Volumetric capture for seamless transitions between live-action footage and CGI', { kind: 'camera', poster: 1.4 }],
        ],
      },
    },
  },
};

const slug = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');
const probe = (f, entries) => execFileSync(FFMPEG.replace(/ffmpeg(\.exe)?$/, (m) => m.replace('ffmpeg', 'ffprobe')), ['-v', 'error', '-show_entries', entries, '-of', 'csv=p=0', f]).toString().trim();

// Some clips carry an audio track that is digital silence (screen recordings); those are encoded without one.
function maxVolume(f) {
  const r = require('child_process').spawnSync(FFMPEG, ['-hide_banner', '-i', f, '-map', '0:a:0', '-af', 'volumedetect', '-vn', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = (r.stderr || '').match(/max_volume: (-?[\d.]+) dB/);
  return m ? Number(m[1]) : -Infinity;
}

async function image(src, dir, name) {
  const target = path.join(dir, name + '.webp');
  const meta = await sharp(src).metadata();
  await sharp(src).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 92, effort: 6 }).toFile(target);
  const out = await sharp(target).metadata();
  return { bytesIn: fs.statSync(src).size, bytesOut: fs.statSync(target).size, from: `${meta.width}x${meta.height}`, to: `${out.width}x${out.height}` };
}

function video(src, out, kind, keepAudio, crf) {
  const k = { ...KIND[kind], ...(crf ? { crf } : {}) };
  const args = ['-v', 'error', '-y', '-i', src, '-map', '0:v:0'];
  if (keepAudio) args.push('-map', '0:a:0');
  args.push('-vf', `scale='min(${k.width},iw)':-2:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(k.crf), '-profile:v', 'high', '-movflags', '+faststart');
  if (keepAudio) args.push('-c:a', 'aac', '-b:a', '128k', '-ac', '2');
  else args.push('-an');
  execFileSync(FFMPEG, [...args, out]);
}

async function poster(src, seconds, out) {
  const png = path.join(os.tmpdir(), 'mocap-poster-' + process.pid + '.png');
  execFileSync(FFMPEG, ['-v', 'error', '-y', '-ss', String(seconds), '-i', src, '-frames:v', '1', png]);
  await sharp(png).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  fs.unlinkSync(png);
}

(async () => {
  const only = process.argv[2] && !process.argv[2].startsWith('--') ? [process.argv[2]] : Object.keys(PROJECTS);
  const imagesOnly = process.argv.includes('--images-only');
  for (const key of only) {
    const p = PROJECTS[key];
    const imgDir = path.join(ROOT, 'src', 'assets', 'work', key);
    const mediaDir = path.join(ROOT, 'public', 'media', key);
    fs.mkdirSync(imgDir, { recursive: true });
    fs.mkdirSync(mediaDir, { recursive: true });
    let inBytes = 0, outBytes = 0;
    const data = {};
    for (const [week, w] of Object.entries(p.weeks)) {
      const n = week.replace('week', 'w');
      const images = [];
      for (let i = 0; i < w.images.length; i++) {
        const [file, title] = w.images[i];
        const name = `${n}-${String(i + 1).padStart(2, '0')}-${slug(title)}`;
        const r = await image(path.join(OLD, 'IMAGE', file), imgDir, name);
        inBytes += r.bytesIn; outBytes += r.bytesOut;
        console.log(`  image ${file.padEnd(26)} ${r.from.padStart(9)} -> ${r.to.padStart(9)}  ${(r.bytesIn / 1e6).toFixed(2)} -> ${(r.bytesOut / 1e6).toFixed(2)} MB`);
        images.push({ file: name, title });
      }
      const clips = [];
      for (let i = 0; i < w.clips.length; i++) {
        const [file, title, opt] = w.clips[i];
        const name = `${n}-${String(i + 1).padStart(2, '0')}-${slug(title)}`;
        const src = path.join(OLD, 'VIDEO', file);
        const sound = maxVolume(src) > -60;
        const mp4 = path.join(mediaDir, name + '.mp4');
        if (!imagesOnly) {
          if (!process.env.ONLY || process.env.ONLY.split(",").includes(file)) video(src, mp4, opt.kind, sound, opt.crf);
          await poster(src, opt.poster, path.join(mediaDir, name + '.webp'));
        }
        const size = fs.existsSync(mp4) ? fs.statSync(mp4).size : 0;
        inBytes += fs.statSync(src).size; outBytes += size;
        const [wd, ht] = probe(mp4, 'stream=width,height').split('\n')[0].split(',').map(Number);
        console.log(`  video ${file.padEnd(32)} ${opt.kind.padEnd(6)} ${sound ? 'sound ' : 'silent'} ${wd}x${ht}  ${(fs.statSync(src).size / 1e6).toFixed(1)} -> ${(size / 1e6).toFixed(1)} MB`);
        clips.push({ src: `/media/${key}/${name}.mp4`, poster: `/media/${key}/${name}.webp`, title, ratio: `${wd} / ${ht}`, ...(sound ? { sound: true } : {}) });
      }
      data[week] = { images, clips };
    }
    // Homepage card: a silent loop and its still.
    const loop = path.join(mediaDir, 'card.mp4');
    const cardSrc = path.join(OLD, 'VIDEO', p.card.video);
    if (!imagesOnly) {
      video(cardSrc, loop, 'loop', false);
      await poster(cardSrc, p.card.poster, path.join(mediaDir, 'cover.webp'));
    }
    inBytes += fs.statSync(cardSrc).size; outBytes += fs.statSync(loop).size;
    console.log(`  card  ${p.card.video}  ${(fs.statSync(cardSrc).size / 1e6).toFixed(1)} -> ${(fs.statSync(loop).size / 1e6).toFixed(1)} MB`);

    const lines = [
      `// Images and clips for the ${key} page, migrated from the old portfolio site.`,
      '// Written by scripts/mocap-media.cjs; edit that script, not this file.',
      `// Images: src/assets/work/${key}/<file>.webp. Clips: public/media/${key}/ (MP4 plus a WebP poster).`,
      "import type { ImageItem } from './private-jet';",
      "import type { Clip } from '../components/Clips.astro';",
      '',
    ];
    for (const [week, d] of Object.entries(data)) lines.push(`export const ${week}: { images: ImageItem[]; clips: Clip[] } = ${JSON.stringify(d, null, 2)};`, '');
    fs.writeFileSync(path.join(ROOT, 'src', 'data', key + '.ts'), lines.join('\n'));
    console.log(`${key}: ${(inBytes / 1e6).toFixed(1)} MB of sources -> ${(outBytes / 1e6).toFixed(1)} MB of web masters\n`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
