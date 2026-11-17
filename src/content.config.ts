import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // One sentence explaining the experience. Shown on cards and under the title.
    summary: z.string(),
    year: z.number(),
    // Project group (see `groups` in src/data/site.ts).
    category: z.enum(['xr', 'visualization', 'mocap', 'games']),
    // A few short tags shown on cards.
    tags: z.array(z.string()),

    // Project overview.
    purpose: z.string().optional(),
    audience: z.string().optional(),
    role: z.string(),
    team: z.string().optional(),
    duration: z.string().optional(),
    client: z.string().optional(),
    platform: z.string().optional(),

    // Credits: collaborators and the tools used.
    credits: z.array(z.object({ name: z.string(), role: z.string() })).optional(),
    tools: z.array(z.string()).default([]),

    // Media. Paths under /public, e.g. '/media/bugatti.mp4' and '/media/bugatti.jpg'.
    video: z.string().optional(),
    poster: z.string().optional(),
    // YouTube video ID (the part after "v=" in the link). Shown at the top of the project page instead of `video`.
    youtube: z.string().optional(),
    // A self-hosted full-length video (with sound) shown at the top instead of `video`, when there is no YouTube upload.
    film: z.object({ src: z.string(), poster: z.string(), ratio: z.string().default('16 / 9') }).optional(),
    // External links shown as buttons on the project page.
    links: z
      .object({
        video: z.string().url().optional(),
        demo: z.string().url().optional(),
        // A short line shown under the buttons, e.g. the password of a restricted demo page.
        demoNote: z.string().optional(),
        code: z.string().url().optional(),
        // Documentation: a full URL, or a file in public/ such as '/docs/manual.pdf'.
        docs: z.string().optional(),
      })
      .optional(),

    accent: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .default('#62e6d3'),
    // Shape of the generated placeholder image until you add a poster.
    motif: z.enum(['car', 'jet', 'portal', 'panels', 'skeleton', 'tracking']).optional(),

    // Featured projects appear in "Featured work", in `order`.
    featured: z.boolean().default(false),
    order: z.number().default(99),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { work };
