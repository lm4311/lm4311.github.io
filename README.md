# Portfolio

Portfolio for an XR Creative Technologist / Designer & Developer. Built with Astro and Tailwind.

```bash
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Structure

- **Navigation:** Work · About · Résumé · Contact. Your name links home.
- **Homepage:** opening section (name, title, intro over an interactive spatial point floor) → Featured work (4 cards) →
  Motion Capture & Performance (2 cards) → short introduction, capabilities and contact.
- **Project groups:** XR & Interactive Experiences, Product Visualization & Film, Motion Capture & Performance.
- **Project pages:** experience first (video/image) → project overview → your contribution → key decisions →
  results and learning → credits.

## Make it yours

| What | Where |
|---|---|
| Name, title, intro, email, LinkedIn | `src/data/site.ts` |
| Capabilities, skills, experience, education | `src/data/site.ts` |
| Résumé | Replace `public/resume.pdf` |
| Projects | `src/content/work/*.mdx` (fields in `src/content.config.ts`) |
| Featured order | `featured: true` and `order` in each project. Set a mocap project to `featured: true` to promote it |
| Card and page images/videos | `poster:` and `video:` in frontmatter, files in `public/media/` |
| Extra stills and before/after sliders | `<Frame src="…" caption="…" />` and `<Compare beforeSrc="…" afterSrc="…" />` in the MDX |
| Architecture diagrams and key numbers (technical projects) | `<Pipeline steps={[…]} />` and `<Stats items={[…]} />` in the MDX; see the OptiTrack project |

Delete `placeholder: true` from a project once it's real.
