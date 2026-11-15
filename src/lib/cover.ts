// Generated placeholder "renders" for projects without a poster or video:
// a dark space with a horizon light, plus a motif
// (car or jet on a studio stage, portal, floating spatial UI, mocap skeleton).
// Drawn as SVG by Cover.astro.

export type Motif = 'car' | 'jet' | 'portal' | 'panels' | 'skeleton' | 'tracking';

/** Coordinates are in a 160 × 90 frame. */
export type Prim =
  | { t: 'rect'; x: number; y: number; w: number; h: number; fill: string; o: number; blur?: number }
  | { t: 'circle'; x: number; y: number; r: number; fill?: string; stroke?: string; sw?: number; o: number; blur?: number }
  | { t: 'poly'; pts: [number, number][]; closed: boolean; fill?: string; stroke?: string; sw?: number; o: number; blur?: number }
  /** Horizontal light line that fades out toward both ends. */
  | { t: 'hglow'; y: number; h: number; color: string; o: number; blur?: number };

export const COVER_W = 160;
export const COVER_H = 90;
export const COVER_TOP = '#0e1014';
export const COVER_BOTTOM = '#040405';

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generic sports-coupe profile as (u along length, v height) pairs.
const CAR_TOP: [number, number][] = [
  [0, 0.2], [0.06, 0.34], [0.3, 0.44], [0.47, 0.8], [0.63, 0.8], [0.82, 0.52], [0.96, 0.48], [1, 0.3],
];
const CAR_BOTTOM: [number, number][] = [[1, 0.1], [0, 0.08]];

// Business-jet side profile as (u along length, v height) pairs.
const JET_TOP: [number, number][] = [
  [0, 0.42], [0.04, 0.6], [0.1, 0.72], [0.17, 0.8], [0.76, 0.8], [0.86, 0.9], [0.93, 1.75], [0.99, 1.75], [0.97, 0.78], [1, 0.62],
];
const JET_BOTTOM: [number, number][] = [[0.95, 0.42], [0.7, 0.3], [0.2, 0.3], [0.06, 0.34]];

// Mocap joints in an action pose: [x, y] relative to figure height, y up from the floor.
const JOINTS: Record<string, [number, number]> = {
  head: [0.04, 0.96], neck: [0.02, 0.84], chest: [0, 0.72], hip: [-0.02, 0.5],
  lsh: [-0.1, 0.82], lel: [-0.24, 0.7], lha: [-0.3, 0.84],
  rsh: [0.12, 0.8], rel: [0.24, 0.66], rha: [0.36, 0.6],
  lkn: [-0.14, 0.27], lft: [-0.26, 0.02], rkn: [0.14, 0.3], rft: [0.22, 0.02],
};
const BONES: [string, string][] = [
  ['head', 'neck'], ['neck', 'chest'], ['chest', 'hip'], ['neck', 'lsh'], ['lsh', 'lel'], ['lel', 'lha'],
  ['neck', 'rsh'], ['rsh', 'rel'], ['rel', 'rha'], ['hip', 'lkn'], ['lkn', 'lft'], ['hip', 'rkn'], ['rkn', 'rft'],
];

export function coverScene(seed: string, accent: string, motif: Motif = 'portal'): Prim[] {
  const r = rng(seed);
  const hy = 52 + r() * 10; // horizon
  const p: Prim[] = [];

  const studio = motif === 'car' || motif === 'jet';
  if (studio) {
    // Studio softbox overhead and its reflection on the floor.
    const sbW = 50 + r() * 50;
    const sbX = 80 - sbW / 2 + (r() - 0.5) * 30;
    const sbY = 6 + r() * 6;
    p.push({ t: 'rect', x: sbX, y: sbY, w: sbW, h: 1.6, fill: '#ffffff', o: 0.9, blur: 1.2 });
    p.push({ t: 'rect', x: sbX - 6, y: sbY - 4, w: sbW + 12, h: 10, fill: '#ffffff', o: 0.07, blur: 6 });
    p.push({ t: 'rect', x: sbX, y: 2 * hy - sbY, w: sbW, h: 2, fill: '#ffffff', o: 0.12, blur: 3 });
  } else {
    // Room-scale floor grid converging toward a vanishing point.
    for (let i = -6; i <= 6; i++) {
      p.push({ t: 'poly', pts: [[80 + i * 4, hy], [80 + i * 26, 90]], closed: false, stroke: accent, sw: 0.25, o: 0.18 });
    }
    for (const f of [0.12, 0.3, 0.58]) {
      const y = hy + (90 - hy) * f;
      p.push({ t: 'poly', pts: [[0, y], [160, y]], closed: false, stroke: accent, sw: 0.25, o: 0.1 + f * 0.15 });
    }
  }

  // Horizon light.
  p.push({ t: 'hglow', y: hy, h: 0.5, color: '#ffffff', o: 0.5 });
  p.push({ t: 'hglow', y: hy - 2, h: 6, color: accent, o: 0.18, blur: 4 });

  if (motif === 'car') {
    const L = 78 + r() * 10;
    const H = 21;
    const x0 = 80 - L / 2 + (r() - 0.5) * 16;
    const map = ([u, v]: [number, number], flip = false): [number, number] => [x0 + u * L, flip ? hy + v * H * 0.9 : hy - v * H];
    const body = [...CAR_TOP, ...CAR_BOTTOM];
    p.push({ t: 'poly', pts: body.map((q) => map(q, true)), closed: true, fill: accent, o: 0.08, blur: 2.5 });
    p.push({ t: 'poly', pts: body.map((q) => map(q)), closed: true, fill: '#020203', o: 1 });
    p.push({ t: 'poly', pts: CAR_TOP.map((q) => map(q)), closed: false, stroke: '#ffffff', sw: 0.5, o: 0.75 });
    p.push({ t: 'poly', pts: CAR_TOP.map((q) => map(q)), closed: false, stroke: accent, sw: 1.6, o: 0.35, blur: 1.5 });
    for (const u of [0.19, 0.8]) {
      const [cx] = map([u, 0]);
      p.push({ t: 'circle', x: cx, y: hy - 4.2, r: 5, fill: '#050506', stroke: '#ffffff', sw: 0.35, o: 0.9 });
    }
  } else if (motif === 'jet') {
    const L = 96;
    const H = 13;
    const x0 = 80 - L / 2 + (r() - 0.5) * 10;
    const base = hy - 4;
    const map = ([u, v]: [number, number], flip = false): [number, number] => [x0 + u * L, flip ? hy + (hy - base) + v * H * 0.9 : base - v * H];
    const body = [...JET_TOP, ...JET_BOTTOM];
    p.push({ t: 'poly', pts: body.map((q) => map(q, true)), closed: true, fill: accent, o: 0.08, blur: 2.5 });
    p.push({ t: 'poly', pts: body.map((q) => map(q)), closed: true, fill: '#020203', o: 1 });
    p.push({ t: 'poly', pts: JET_TOP.map((q) => map(q)), closed: false, stroke: '#ffffff', sw: 0.5, o: 0.75 });
    p.push({ t: 'poly', pts: JET_TOP.map((q) => map(q)), closed: false, stroke: accent, sw: 1.4, o: 0.35, blur: 1.5 });
    // Cabin windows and landing gear.
    for (let i = 0; i < 7; i++) {
      const [wx, wy] = map([0.24 + i * 0.065, 0.62]);
      p.push({ t: 'circle', x: wx, y: wy, r: 0.9, fill: accent, o: 0.8 });
    }
    for (const u of [0.18, 0.62]) {
      const [gx, gy] = map([u, 0.3]);
      p.push({ t: 'poly', pts: [[gx, gy], [gx, hy - 1.2]], closed: false, stroke: '#ffffff', sw: 0.4, o: 0.6 });
      p.push({ t: 'circle', x: gx, y: hy - 1.2, r: 1.2, fill: '#050506', stroke: '#ffffff', sw: 0.3, o: 0.9 });
    }
  } else if (motif === 'skeleton') {
    const H = 38;
    const fx = 80 + (r() - 0.5) * 30;
    const j = (k: string): [number, number] => [fx + JOINTS[k][0] * H, hy + 2 - JOINTS[k][1] * H];
    for (const [a, b] of BONES) p.push({ t: 'poly', pts: [j(a), j(b)], closed: false, stroke: '#ffffff', sw: 0.45, o: 0.55 });
    for (const k of Object.keys(JOINTS)) {
      const [x, y] = j(k);
      p.push({ t: 'circle', x, y, r: 2.2, fill: accent, o: 0.35, blur: 1.5 });
      p.push({ t: 'circle', x, y, r: 0.9, fill: accent, o: 1 });
    }
  } else if (motif === 'tracking') {
    // Optical tracking volume: cameras on an overhead truss, several tracked
    // players (headset marker clusters) and the network links between them.
    p.push({ t: 'poly', pts: [[8, 9], [152, 9]], closed: false, stroke: '#ffffff', sw: 0.35, o: 0.35 });
    const players: [number, number][] = [
      [46 + r() * 8, hy + 10],
      [84 + r() * 6, hy + 4],
      [118 + r() * 8, hy + 14],
    ];
    for (let i = 0; i < 6; i++) {
      const camX = 14 + i * 26.4;
      p.push({ t: 'rect', x: camX - 2.2, y: 7.6, w: 4.4, h: 3, fill: '#ffffff', o: 0.7 });
      p.push({ t: 'circle', x: camX, y: 11.8, r: 0.9, fill: accent, o: 0.9 });
      // Each camera sees the nearest players.
      for (const [px, py] of players) {
        if (Math.abs(px - camX) < 45) {
          p.push({ t: 'poly', pts: [[camX, 12], [px, py - 22]], closed: false, stroke: accent, sw: 0.2, o: 0.14 });
        }
      }
    }
    players.forEach(([px, py], i) => {
      const head = py - 22;
      p.push({ t: 'poly', pts: [[px, py], [px, head + 3]], closed: false, stroke: '#ffffff', sw: 0.4, o: 0.35 });
      p.push({ t: 'circle', x: px, y: py, r: 4, stroke: accent, sw: 0.4, o: 0.5 });
      for (const [dx, dy] of [[-2.6, 0], [2.6, -0.6], [0.4, -2.4], [1.2, 1.6]] as [number, number][]) {
        p.push({ t: 'circle', x: px + dx, y: head + dy, r: 2, fill: accent, o: 0.3, blur: 1 });
        p.push({ t: 'circle', x: px + dx, y: head + dy, r: 0.8, fill: '#ffffff', o: 1 });
      }
      const next = players[(i + 1) % players.length];
      p.push({ t: 'poly', pts: [[px, head], [next[0], next[1] - 22]], closed: false, stroke: '#ffffff', sw: 0.3, o: 0.25 });
    });
  } else if (motif === 'panels') {
    // Floating spatial UI windows wrapping around the viewer, and a pointer ray.
    const cy = 30 + r() * 6;
    const panels: [number, number, number][] = [
      [34, -6, 0.75],
      [80, 0, 1],
      [126, 6, 0.75],
    ];
    for (const [x, skew, s] of panels) {
      const w = 34 * s;
      const h = 22 * s;
      const pts: [number, number][] = [
        [x - w / 2, cy - h / 2 - skew * 0.3],
        [x + w / 2, cy - h / 2 + skew * 0.3],
        [x + w / 2, cy + h / 2 - skew * 0.3],
        [x - w / 2, cy + h / 2 + skew * 0.3],
      ];
      p.push({ t: 'poly', pts, closed: true, fill: accent, o: 0.08 });
      p.push({ t: 'poly', pts, closed: true, stroke: '#ffffff', sw: 0.4, o: 0.6 });
      p.push({ t: 'rect', x: x - w / 2 + 3 * s, y: cy + h / 2 - 6 * s, w: w * 0.45, h: 1.4 * s, fill: '#ffffff', o: 0.45 });
    }
    const tx = 80 + (r() - 0.5) * 16;
    p.push({ t: 'poly', pts: [[118, 88], [tx, cy]], closed: false, stroke: accent, sw: 0.5, o: 0.7 });
    p.push({ t: 'circle', x: tx, y: cy, r: 3, fill: accent, o: 0.4, blur: 1.5 });
    p.push({ t: 'circle', x: tx, y: cy, r: 1.1, fill: '#ffffff', o: 1 });
  } else {
    const cx = 80 + (r() - 0.5) * 30;
    const rad = 18;
    p.push({ t: 'circle', x: cx, y: hy - rad, r: rad, fill: accent, o: 0.12, blur: 5 });
    for (let i = 0; i < 4; i++) {
      p.push({ t: 'circle', x: cx, y: hy - rad, r: rad - i * 4.5, stroke: accent, sw: 0.5, o: 0.85 - i * 0.18 });
    }
    p.push({ t: 'circle', x: cx, y: hy + rad * 0.9, r: rad, stroke: accent, sw: 0.5, o: 0.12, blur: 1.5 });
  }
  return p;
}
