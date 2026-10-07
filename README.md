# Gogada Prameela – portfolio

One-page portfolio of Gogada Prameela, final-year B.Tech ECE student (class of 2027): software and embedded systems.

Built with Next.js (App Router), Tailwind CSS, React Three Fiber + Rapier (3D ID card) and Motion (scroll animations). Hosted at [prameelagogada.com](https://prameelagogada.com) on the AIAGENTECHX platform (Docker image built by `.github/workflows/docker.yml`, deployed by `aiagentechx-infra`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
```

## Where things are

| Path | What it does |
| --- | --- |
| `lib/content.ts` | Every word and fact on the site. Edit text here. |
| `app/page.tsx` | The page: sections in order, Person structured data, footer |
| `app/layout.tsx` | Fonts (Inter, Instrument Serif), title, description, link-preview metadata |
| `components/Hero.tsx` | Intro clip, Sound button with captions, transcript, shrink-on-scroll |
| `components/About.tsx` | About text, quick facts and the ID card |
| `components/IdCard.tsx` | Chooses the flat card (phones, reduced motion) or the 3D card (laptops) |
| `components/Lanyard.tsx` | The 3D card on a lanyard (physics + card face drawn in code) |
| `components/Skills.tsx` | "Periodic table" of skills with filters and detail panel |
| `components/Work.tsx`, `Journey.tsx`, `Contact.tsx` | The other sections |
| `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx` | SEO: sitemap, robots, link-preview image, favicon |
| `public/llms.txt` | Short summary for AI assistants |

The Learning and Achievements sections appear automatically once `learning` has 2 entries and `achievements` has 3 in `lib/content.ts`.

The site address defaults to `https://prameelagogada.com`; override it with the `NEXT_PUBLIC_SITE_URL` build arg in the `Dockerfile`.

## AI assistance

This site was built through AI-assisted development (vibe coding) with Claude in VS Code and GitHub Copilot. I wrote the prompts and the content, and reviewed, tested and committed each change. The intro video's character and voice are AI-generated (Gemini image generation and Google Flow), made from my own photo.

## Credits

- 3D ID card technique from Vercel's [Building an interactive 3D event badge with React Three Fiber](https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber) and the [React Bits Lanyard](https://reactbits.dev/components/lanyard) component (MIT + Commons Clause).
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) and [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (Google Fonts).
