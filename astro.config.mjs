// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// The homepage's 3D opening is one large script (three.js and the scene). The page only asks for it once its own
// small script has run, which is a wasted wait. Naming it in the homepage's head lets the browser fetch it at once,
// alongside the styles. The file's name changes with every build, so the line is added after the build.
/** @type {import('astro').AstroIntegration} */
const preloadHero = {
  name: 'preload-hero',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const out = fileURLToPath(dir);
      const chunk = fs.readdirSync(path.join(out, '_astro')).find((f) => /^hero-studio\..+\.js$/.test(f));
      const page = path.join(out, 'index.html');
      if (!chunk || !fs.existsSync(page)) return logger.warn('The 3D opening script was not found; nothing preloaded.');
      const html = fs.readFileSync(page, 'utf8');
      if (!html.includes('</head>')) return logger.warn('The homepage has no </head>; nothing preloaded.');
      fs.writeFileSync(page, html.replace('</head>', `<link rel="modulepreload" href="/_astro/${chunk}"></head>`));
      logger.info(`The homepage preloads ${chunk}`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://lukemucg.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), preloadHero]
});
