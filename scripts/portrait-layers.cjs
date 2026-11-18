// Splits the About page portrait into two layers, so it can be shown with real depth:
//   public/portrait-subject.webp   the person, cut out (transparent around them)
//   public/portrait-backdrop.webp  the studio backdrop alone, with the person painted out
//
//   node scripts/portrait-layers.cjs            (reads public/portrait.webp)
//   node scripts/portrait-layers.cjs path/to/photo.png
//
// It works for a portrait on a plain, smooth studio backdrop: the backdrop is found by growing inward from the
// picture's edges for as long as the brightness changes only gradually, which stops at the outline of the person.
// Run it again whenever the portrait changes, then check the two files by eye.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const source = process.argv[2] || path.join(root, 'public', 'portrait.webp');
const STEP = 5; // the most the backdrop's brightness may change from one pixel to the next
const FLOOR = 150; // nothing darker than this is backdrop
const FEATHER = 1.2; // softness of the cut edge, in pixels

(async () => {
  const image = sharp(source).removeAlpha();
  const { width: W, height: H } = await image.metadata();
  // One brightness value per pixel, and three colour values per pixel, whatever the file's own format.
  const one = (img) => img.extractChannel(0).raw().toBuffer();
  const grey = await one(image.clone().greyscale());
  const rgb = await image.clone().toColourspace('srgb').raw().toBuffer();
  if (grey.length !== W * H || rgb.length !== W * H * 3) throw new Error('Unexpected pixel format');

  // 1. Grow the backdrop inward from the edges.
  const backdrop = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0, tail = 0;
  const seed = (i) => { if (!backdrop[i] && grey[i] >= FLOOR) { backdrop[i] = 1; queue[tail++] = i; } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % W, y = (i - x) / W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j < 0 || backdrop[j] || grey[j] < FLOOR || Math.abs(grey[j] - grey[i]) > STEP) continue;
      backdrop[j] = 1; queue[tail++] = j;
    }
  }
  const share = (tail / (W * H)) * 100;

  // 2. The person: everything that is not backdrop, with a softened edge pulled in slightly so no pale fringe remains.
  const hard = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) hard[i] = backdrop[i] ? 0 : 255;
  const alpha = await one(
    sharp(hard, { raw: { width: W, height: H, channels: 1 } })
      .blur(FEATHER)
      .linear(1.6, -80), // steepen the soft edge and move it inward
  );
  const cutout = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    cutout[i * 4] = rgb[i * 3]; cutout[i * 4 + 1] = rgb[i * 3 + 1]; cutout[i * 4 + 2] = rgb[i * 3 + 2]; cutout[i * 4 + 3] = alpha[i];
  }
  const subjectFile = path.join(root, 'public', 'portrait-subject.webp');
  await sharp(cutout, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(subjectFile);

  // 3. The backdrop alone: at low resolution (it is smooth), fill the person's area by repeatedly averaging inward
  //    from the surrounding backdrop, then scale back up.
  const N = 64;
  const small = await one(image.clone().greyscale().resize(N, N, { kernel: 'cubic' }));
  const known = await one(sharp(Buffer.from(backdrop.map((b) => b * 255)), { raw: { width: W, height: H, channels: 1 } }).resize(N, N, { kernel: 'cubic' }));
  const fixed = new Uint8Array(N * N);
  const value = new Float32Array(N * N);
  let mean = 0, count = 0;
  for (let i = 0; i < N * N; i++) if (known[i] > 250) { fixed[i] = 1; value[i] = small[i]; mean += small[i]; count++; }
  mean /= count;
  for (let i = 0; i < N * N; i++) if (!fixed[i]) value[i] = mean;
  for (let pass = 0; pass < 3000; pass++) {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x;
      if (fixed[i]) continue;
      const l = value[y * N + Math.max(0, x - 1)], r = value[y * N + Math.min(N - 1, x + 1)];
      const u = value[Math.max(0, y - 1) * N + x], d = value[Math.min(N - 1, y + 1) * N + x];
      value[i] = (l + r + u + d) / 4;
    }
  }
  const plate = Buffer.from(value.map((v) => Math.round(v)));
  const backdropFile = path.join(root, 'public', 'portrait-backdrop.webp');
  await sharp(plate, { raw: { width: N, height: N, channels: 1 } }).resize(W, H, { kernel: 'cubic' }).blur(6).webp({ quality: 82 }).toFile(backdropFile);

  const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(1)} KB`;
  console.log(`backdrop found: ${share.toFixed(1)}% of the picture`);
  console.log(`portrait-subject.webp ${kb(subjectFile)}, portrait-backdrop.webp ${kb(backdropFile)}`);
})();
