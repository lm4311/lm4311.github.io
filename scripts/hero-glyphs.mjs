// Makes src/data/hero-glyphs.json: the outlines of the name in the homepage's 3D opening, taken from Instrument Sans.
//
//   node scripts/hero-glyphs.mjs            ("Luke Mu")
//   node scripts/hero-glyphs.mjs "New Name"
//
// Run it again only if the name or the typeface changes. Needs the dev dependencies fontkit, wawoff2 and clipper-lib.
//
// Variable fonts draw letters from overlapping, self-crossing contours (the M crosses itself), which cannot be
// extruded as they are. Each glyph's curves are flattened and then unioned with Clipper (non-zero fill), giving
// simple outer polygons with their holes, in font units.
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import ClipperLib from 'clipper-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontFile = path.join(root, 'node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2');
const outFile = path.join(root, 'src/data/hero-glyphs.json');
const TEXT = process.argv[2] || 'Luke Mu';
const WEIGHT = 600; // semi-bold
const TRACK = -0.02; // letter-spacing, in em
const STEPS = 14; // straight segments per curve
const K = 100; // Clipper works in integers

const ttf = Buffer.from(await wawoff2.decompress(fs.readFileSync(fontFile)));
const base = fontkit.create(ttf);
const font = base.getVariation({ wght: WEIGHT });
const run = base.layout(TEXT); // glyph ids and kerning (the weight instance cannot lay out text itself)
const upm = base.unitsPerEm;

function flatten(commands) {
  const paths = [];
  let cur = null, x = 0, y = 0;
  for (const c of commands) {
    const a = c.args;
    if (c.command === 'moveTo') { cur = [[a[0], a[1]]]; paths.push(cur); [x, y] = a; }
    else if (c.command === 'lineTo') { cur.push([a[0], a[1]]); [x, y] = a; }
    else if (c.command === 'quadraticCurveTo') {
      for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * x + 2 * u * t * a[0] + t * t * a[2], u * u * y + 2 * u * t * a[1] + t * t * a[3]]); }
      x = a[2]; y = a[3];
    } else if (c.command === 'bezierCurveTo') {
      for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u ** 3 * x + 3 * u * u * t * a[0] + 3 * u * t * t * a[2] + t ** 3 * a[4], u ** 3 * y + 3 * u * u * t * a[1] + 3 * u * t * t * a[3] + t ** 3 * a[5]]); }
      x = a[4]; y = a[5];
    }
  }
  return paths;
}

function clean(paths) {
  const subject = paths.map((p) => p.map(([px, py]) => ({ X: Math.round(px * K), Y: Math.round(py * K) })));
  const clipper = new ClipperLib.Clipper();
  clipper.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  const tree = new ClipperLib.PolyTree();
  clipper.Execute(ClipperLib.ClipType.ctUnion, tree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  const pts = (contour) => ClipperLib.Clipper.CleanPolygon(contour, 6).map((p) => [Math.round(p.X / (K / 10)) / 10, Math.round(p.Y / (K / 10)) / 10]);
  const polys = [];
  const walk = (node) => {
    for (const child of node.Childs()) {
      if (!child.IsHole()) polys.push({ o: pts(child.Contour()), h: child.Childs().map((h) => pts(h.Contour())) });
      for (const hole of child.Childs()) walk(hole); // islands inside holes
    }
  };
  walk(tree);
  return polys;
}

let x = 0;
const glyphs = [];
run.glyphs.forEach((g, i) => {
  const kern = run.positions[i].xAdvance - g.advanceWidth;
  const vg = font.getGlyph(g.id);
  const paths = flatten(vg.path.commands);
  if (paths.length) glyphs.push({ x: Math.round(x), p: clean(paths) });
  x += vg.advanceWidth + kern + TRACK * upm;
});

// text: what was set. cap: capital height. width: the whole line. glyphs[].x: where each letter starts.
// glyphs[].p: its polygons, each with an outline `o` and holes `h`.
const data = { text: TEXT, upm, cap: base.capHeight, width: Math.round(x - TRACK * upm), glyphs };
fs.writeFileSync(outFile, JSON.stringify(data));
console.log(`${path.relative(root, outFile)}: "${TEXT}", ${glyphs.length} letters, ${(fs.statSync(outFile).size / 1024).toFixed(1)} KB`);
