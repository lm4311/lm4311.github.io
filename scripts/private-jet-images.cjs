// Turns the PlaneViz renders into web masters for the Private Jet page, and writes src/data/private-jet.ts.
// Astro makes the sizes the site actually serves (AVIF/WebP, several widths) from these masters at build time.
//
//   node scripts/private-jet-images.cjs
//
// Sources (not changed): D:\Planeviz\Saved\MovieRenders\CabinStills
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CS = 'D:/Planeviz/Saved/MovieRenders/CabinStills';
const OUT = path.join(__dirname, '..', 'src', 'assets', 'work', 'private-jet');
const DATA = path.join(__dirname, '..', 'src', 'data', 'private-jet.ts');
const QUALITY = 92;
const TEXTURE_SIZE = 640; // texture maps are shown as previews, not as full-resolution files

const STILLS = [
  ['Still01_Galley_Marble', '01-galley-countertop', 'Galley countertop'],
  ['Still02_Galley_Wide', '02-galley', 'Galley'],
  ['Still03_Lounge_Hero', '03-main-lounge', 'Main lounge'],
  ['Still04_ClubSeat', '04-club-seat', 'Club seat'],
  ['Still05_Ledge_StillLife', '05-side-ledge', 'Side ledge'],
  ['Still06_Dining_Table', '06-dining-table', 'Dining table'],
  ['Still07_Dining_Wide', '07-dining-area', 'Dining area'],
  ['Still08_Divan_Sofa', '08-divan', 'Divan'],
  ['Still09_Divan_Shelves', '09-divan-shelves', 'Divan shelves'],
  ['Still10_Bedroom', '10-bedroom', 'Bedroom'],
  ['Still11_Bedroom_Vase', '11-bedroom-detail', 'Bedroom detail'],
  ['Still12_Lav_Vanity', '12-lavatory-vanity', 'Lavatory vanity'],
  ['Still13_Leather_Stitch', '13-seat-stitching', 'Seat stitching'],
];
// Shots that have a full set of render passes, in the order shown on the page.
const PASS_SHOTS = ['Still03_Lounge_Hero', 'Still01_Galley_Marble', 'Still04_ClubSeat', 'Still06_Dining_Table', 'Still12_Lav_Vanity', 'Still13_Leather_Stitch'];
const PASSES = [
  ['01_Final', '01-final-image', 'Final image'],
  ['02_LightingOnly', '02-lighting-only', 'Lighting only'],
  ['03_DetailLighting', '03-detail-lighting', 'Detail lighting'],
  ['04_ReflectionsOnly', '04-reflections-only', 'Reflections only'],
  ['05_Unlit', '05-unlit', 'Unlit'],
  ['06_Roughness', '06-roughness', 'Roughness'],
  ['07_Specular', '07-specular', 'Specular'],
  ['08_WorldNormal', '08-world-normal', 'World normal'],
  ['09_SceneDepth', '09-scene-depth', 'Scene depth', 'Levels raised'],
];
const MATERIAL_TITLES = {
  '01_Galley_Marble_Countertop': 'Galley countertop',
  '02_Galley_Oak_Veneer_Gloss': 'Galley backsplash',
  '03_Galley_Chrome_Tap': 'Galley tap',
  '04_ClubSeat_Fabric': 'Club seat fabric',
  '05_Ledge_Burl_Veneer': 'Side ledge inset',
  '06_Dining_Table_Mahogany': 'Dining table',
  '07_Lavatory_Black_Marble': 'Lavatory vanity',
  '08_Seat_Shell_And_Stitching': 'Seat back shell and stitching',
  '09_Cabin_Carpet': 'Cabin carpet',
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const out = (...p) => {
  const f = path.join(OUT, ...p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};
const webp = (img, file) => img.webp({ quality: QUALITY, effort: 6 }).toFile(file);

// Dark masks: stretch each channel to the full range and lift the mid-tones, so they read on screen.
async function raised(src, size) {
  const { data, info } = await sharp(src).removeAlpha().resize(size, size, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  const c = info.channels;
  for (let ch = 0; ch < c; ch++) {
    let lo = 255, hi = 0;
    for (let i = ch; i < data.length; i += c) { if (data[i] < lo) lo = data[i]; if (data[i] > hi) hi = data[i]; }
    const range = Math.max(1, hi - lo);
    for (let i = ch; i < data.length; i += c) data[i] = Math.round(255 * Math.pow((data[i] - lo) / range, 1 / 2.4));
  }
  return sharp(data, { raw: info });
}

(async () => {
  let count = 0;
  // Final stills and their lighting-only (clay) versions.
  for (const [src, file] of STILLS) {
    await webp(sharp(`${CS}/${src}_Beauty.png`), out('stills', `${file}.webp`));
    await webp(sharp(`${CS}/${src}_Clay.png`), out('clay', `${file}.webp`));
    count += 2;
  }
  // Render passes.
  const passes = [];
  for (const shot of PASS_SHOTS) {
    const [, file, title] = STILLS.find((s) => s[0] === shot);
    const dir = `passes/${file}`;
    for (const [suffix, name] of PASSES) {
      const img = sharp(`${CS}/CaseStudy/03_Render_Passes/${shot}/${shot}_${suffix}.png`);
      await webp(suffix.endsWith('SceneDepth') ? img.normalise() : img, out(dir, `${name}.webp`));
      count++;
    }
    passes.push({ dir, title, items: PASSES.map(([, f, t, note]) => (note ? { file: f, title: t, note } : { file: f, title: t })) });
  }
  // Texture maps, as previews.
  const spec = JSON.parse(fs.readFileSync(`${CS}/CaseStudy/_scripts/material_spec.json`, 'utf8'));
  const textures = [];
  for (const m of spec.materials) {
    const dir = `textures/${slug(m.key)}`;
    const items = [];
    let n = 0;
    for (const [label, asset] of m.textures) {
      const src = `${CS}/CaseStudy/textures_raw/${asset.split('/').pop()}.png`;
      const meta = await sharp(src).metadata();
      const isMask = /detail|mask/i.test(label);
      const file = `${String(++n).padStart(2, '0')}-${slug(label)}`;
      const img = isMask ? await raised(src, TEXTURE_SIZE) : sharp(src).removeAlpha().resize(TEXTURE_SIZE, TEXTURE_SIZE, { fit: 'inside' });
      await webp(img, out(dir, `${file}.webp`));
      count++;
      items.push({ file, title: label, note: `${meta.width} × ${meta.height}${isMask ? ', levels raised' : ''}` });
    }
    textures.push({ dir, title: MATERIAL_TITLES[m.key] ?? m.title, items });
  }

  const stills = STILLS.map(([, file, title]) => ({ file, title }));
  const ts = `// Image lists for the Private Jet page. Written by scripts/private-jet-images.cjs; edit that script, not this file.
// \`file\` is an image in src/assets/work/private-jet/<dir>/ without its extension.

export interface ImageItem {
  file: string;
  title: string;
  note?: string;
}
export interface ImageGroup {
  dir: string;
  title: string;
  items: ImageItem[];
}

/** The 13 final stills. The lighting-only (clay) versions use the same file names in clay/. */
export const stills: ImageItem[] = ${JSON.stringify(stills, null, 2)};

/** Render passes for the six hero stills. */
export const passes: ImageGroup[] = ${JSON.stringify(passes, null, 2)};

/** Texture maps behind the nine hero materials. */
export const textures: ImageGroup[] = ${JSON.stringify(textures, null, 2)};
`;
  fs.writeFileSync(DATA, ts);
  console.log(`${count} images written to ${OUT}`);
})();
