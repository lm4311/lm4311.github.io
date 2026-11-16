// Optimized images for project pages. Masters live in src/assets/work/<set>/; the build makes
// AVIF and WebP versions at several widths, so each screen downloads only the size it needs.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const sources = import.meta.glob<{ default: ImageMetadata }>('/src/assets/work/**/*.{webp,jpg,jpeg,png}', {
  eager: true,
});

/** Look up a master image, e.g. workImage('private-jet/stills', '03-main-lounge'). */
export function workImage(set: string, file: string): ImageMetadata {
  const hit = Object.entries(sources).find(([p]) => p.replace(/\.\w+$/, '') === `/src/assets/work/${set}/${file}`);
  if (!hit) throw new Error(`No image "${file}" in src/assets/work/${set}/`);
  return hit[1].default;
}

export interface Responsive {
  avif: string;
  webp: string;
  fallback: string;
  width: number;
  height: number;
}

/** AVIF + WebP srcsets for an image shown in the page. */
export async function responsive(src: ImageMetadata, widths: number[]): Promise<Responsive> {
  const fit = widths.filter((w) => w <= src.width);
  const use = fit.length > 0 ? fit : [src.width];
  const [avif, webp] = await Promise.all([
    getImage({ src, format: 'avif', widths: use, quality: 62 }),
    getImage({ src, format: 'webp', widths: use, quality: 82 }),
  ]);
  return {
    avif: avif.srcSet.attribute,
    webp: webp.srcSet.attribute,
    fallback: webp.src,
    width: Number(webp.attributes.width),
    height: Number(webp.attributes.height),
  };
}

/** A single large WebP for the image viewer. */
export async function large(src: ImageMetadata, width: number, quality = 84): Promise<string> {
  return (await getImage({ src, format: 'webp', width: Math.min(width, src.width), quality })).src;
}

/** Grid layouts shared by the gallery components. */
export const GRIDS = {
  2: {
    grid: 'grid-cols-1 sm:grid-cols-2',
    widths: [480, 800, 1200, 1600],
    sizes: '(min-width: 1280px) 590px, (min-width: 640px) 50vw, 100vw',
  },
  3: {
    grid: 'grid-cols-2 lg:grid-cols-3',
    widths: [400, 800, 1200],
    sizes: '(min-width: 1280px) 390px, (min-width: 1024px) 33vw, 50vw',
  },
  6: {
    grid: 'grid-cols-3 sm:grid-cols-6',
    widths: [200, 400, 640],
    sizes: '(min-width: 1280px) 185px, (min-width: 640px) 16vw, 33vw',
  },
} as const;
export const LEAD = { widths: [480, 800, 1200, 1600, 2400], sizes: '(min-width: 1280px) 1200px, 100vw' };
