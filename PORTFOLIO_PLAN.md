# Portfolio build brief: Gogada Prameela

Build brief for the coding assistant (Claude in VS Code). It is generated from the shared plan "Portfolio Website Plan: Gogada Prameela" (7 Oct 2026). If the two ever disagree, ask before guessing.

## 1. Context

- Owner: **Gogada Prameela**, final-year B.Tech Electronics and Communication Engineering (ECE), Avanthi Institute of Engineering & Technology, class of 2027, Vizianagaram, Andhra Pradesh.
- Goal: a one-page portfolio that a recruiter understands in 10 seconds: who she is, her CAN project, and a resume download. It also proves the "AI-assisted development (vibe coding)" line on her resume.
- Audience: both software and embedded/automotive recruiters. Many open the link on a phone.
- She must be able to explain every file in an interview. After each step, explain what you changed in plain language for a beginner.

## 2. Folders on this laptop (Windows)

```text
D:\Personal\prameela\
├─ portfolio\            the Next.js project (create it here in step B)
└─ portfolio-assets\     ready-made files (do not edit; copy from here)
   ├─ PORTFOLIO_PLAN.md  this brief
   ├─ public\            copy everything into portfolio\public\ after step B
   └─ source\            originals; never copy into the project or commit
```

## 3. Ready-made files (portfolio-assets\public\)

| File | What it is | Use |
| --- | --- | --- |
| `intro.webm` | Intro clip, 1920×1080, 10 s, VP9 + Opus, ~1.8 MB | Hero video, first `<source>` |
| `intro.mp4` | Same clip, H.264 + AAC, ~1.9 MB, faststart | Hero video fallback (Safari) |
| `intro-720.mp4` | 1280×720, ~0.9 MB | Hero video below 768 px |
| `intro-poster.webp` / `.jpg` | First frame of the clip | Video poster; LCP image |
| `intro.vtt` | WebVTT captions with timings | `<track kind="captions">`; also render the same words as visible transcript text |
| `avatar-full.webp` | Full-body 3D character, 1920×1080 | Base for the Open Graph image |
| `card-photo.webp` / `.png` | Head-and-shoulders, 460×575 | Photo on the ID card |
| `resume.pdf` | Software-jobs resume | Main "Resume" button |
| `resume-embedded.pdf` | Embedded/automotive resume | Secondary link "Embedded version" |

Clip notes: the background is pure white (it was levelled), so `mix-blend-mode: multiply` blends it into the off-white page. She is framed from the waist up. The voice is AI-generated: always show a small "AI-generated intro" note near the video. Spoken line (verify against the audio and fix `intro.vtt` if different): *"Hi, I'm Prameela, a final-year ECE student who builds software and hardware projects. Have a look around!"*

## 4. Git and GitHub (two accounts on this laptop: IMPORTANT)

Another person's GitHub account is signed in on this machine. Every commit and push must use **her** account `prameela-ai`. Use PowerShell in the VS Code terminal.

**A. Before creating the app (in the empty folder):**

```powershell
cd D:\Personal\prameela\portfolio
git init
git config user.name "Gogada Prameela"
git config user.email "<her private GitHub email from GitHub → Settings → Emails, ends in @users.noreply.github.com>"
```

Local config only (no `--global`). Ask the user for the email if it is not given.

**B. Create the app in the same folder:**

```powershell
npx create-next-app@latest . --disable-git --use-npm
```

Recommended defaults: TypeScript, ESLint, Tailwind CSS, App Router. If it refuses because the folder is not empty, scaffold into a temporary folder and move the files in, keeping `.git`. Then copy `D:\Personal\prameela\portfolio-assets\public\*` into `public\`.

**C. First push (after `npm run dev` works).** This replaces GitHub's suggested snippet:

```powershell
git add .
git commit -m "Initial Next.js portfolio"
git branch -M main
git remote add origin https://prameela-ai@github.com/prameela-ai/portfolio.git
git push -u origin main
```

`prameela-ai@` in the URL makes Git Credential Manager ask for her login instead of reusing the other account. On the sign-in window, use the device-code option and complete it at github.com/login/device in an InPrivate/Incognito window signed in as prameela-ai. Verify with `git log -1 --format="%an <%ae>"`. Push from the terminal; if VS Code offers GitHub sign-in for Git, use her account or disable "GitHub: Git Authentication" for this workspace. Commit after every working step with a clear message.

**D. Deploy:** vercel.com → "Continue with GitHub" in an InPrivate window as prameela-ai → import `prameela-ai/portfolio` (Hobby plan, free).

## 5. Design

- Look: warm off-white background (around `#F5F1E8`), dark navy accent (around `#1E2A4A`), bold sans headlines with **one italic serif accent word** per heading ("Hi, I'm *Prameela.*"), small numbered labels ("01 — ABOUT"), floating pill navigation top-right that highlights the current section.
- Fonts via `next/font/google`: Inter (headings and body) and Instrument Serif (italic accent words).
- Body text at least 16 px, good contrast, large tap targets, alt text on every image.
- Inspired by a reference portfolio of another student: use the layout ideas only; all words must be hers.

## 6. Sections (one page, in this order)

| # | Section | Heading | Content |
| --- | --- | --- | --- |
| 1 | Hero | Software & *Embedded.* | Clip centred; "PRAMEELA" in huge, very light letters behind; bottom-left label "B.TECH ECE · CLASS OF 2027" and the headline; bottom-right "Explore work" and "Resume" buttons; transcript text and "AI-generated intro" note; small Sound button |
| 2 | About | Hi, I'm *Prameela.* | 3D lanyard ID card on the right; three sentences about her (TODO from her); quick facts: Vizianagaram, AP · B.Tech ECE, Avanthi Institute · Batch 2023–27 · Focus: software and embedded systems; one motto line (TODO from her); Résumé / GitHub / LinkedIn buttons |
| 3 | Skills | The periodic table *of my stack.* | Element-style tiles grouped by family with filter chips. Languages: C, Py, Ml (MATLAB). Web: Js, Re (React), Nx (Next.js), Tw (Tailwind CSS), Th (Three.js). AI: Vc (vibe coding), Cl (Claude), Cp (Copilot). Hardware: Rp (Raspberry Pi), Es (ESP32). Protocols: Cn (CAN), Ua (UART), Sp (SPI), Ic (I²C). Tools: Lx (Linux), Gt (Git), Pt (pytest). Hover/tap shows one line on how she used it. |
| 4 | Work | Things *I've built.* | Card 1: CAN project (below). Card 2: this portfolio (Next.js, React Three Fiber, AI-assisted development). |
| 5 | Journey | My *journey.* | Vertical timeline: 2020 SSC 98% (Z.P.H. School, Jami) · 2022 Intermediate 65% (Punyagiri Junior College) · 2023 B.Tech ECE starts (75% so far) · Sep 2026 CAN project starts · 2027 graduation |
| 6 | Learning | Always *learning.* | Hidden until she has two real courses/certificates |
| 7 | Achievements | Proud *moments.* | Hidden until she has three real numbers |
| 8 | Contact | Let's *talk.* | Email prameelagogada4@gmail.com, LinkedIn (TODO URL), GitHub https://github.com/prameela-ai, resume download. **No phone number, date of birth or address on the site.** |

CAN project card text:

- Title: Automated Validation and Anomaly Detection for In-Vehicle CAN Networks (final-year project, Sep 2026 – Apr 2027, in progress)
- Summary: A bench-top car network: a Raspberry Pi 4 gateway and two ESP32-S3 boards acting as engine and ABS control units talk over a real CAN bus. A C program on Linux SocketCAN decodes the signals from a DBC file, and an automated pytest suite injects faults and produces PASS/FAIL reports. Next: machine-learning detection of spoofed messages and decoding a 433 MHz tyre-pressure sensor with an RTL-SDR.
- Tags: Embedded C, Python, Linux, Raspberry Pi, ESP32, CAN, pytest
- Phase tracker: Phase 1 CAN + validation (in progress) · Phase 2 ML anomaly detection (next) · Phase 3 radio + final report (later)

## 7. Build tasks (do in order; run, check and commit after each)

1. **Skeleton:** Next.js App Router + Tailwind, the eight sections with real content from section 6, pill navigation, fonts, colours. Hide Learning and Achievements.
2. **Hero:** `<video>` muted, autoplay, loop, playsInline, `preload="metadata"`, poster `/intro-poster.webp`, sources `/intro.webm` then `/intro.mp4`; on screens under 768 px use `/intro-720.mp4`. Fixed width/height (or aspect-ratio) so nothing shifts. `mix-blend-mode: multiply`. Sound button restarts with sound and shows captions from `/intro.vtt`. As the visitor scrolls, the clip shrinks and fades. With `prefers-reduced-motion`, show only the poster.
3. **ID card (About):** React Bits `<Lanyard />` (React Three Fiber, Drei, Rapier, MeshLine; copy the install command from reactbits.dev/components/lanyard). Card front built in code from `/card-photo.webp` plus text "STUDENT ID", "Gogada Prameela", "B.Tech ECE · Class of 2027", "Software & Embedded" and a QR code to `/resume.pdf` (e.g. Drei `RenderTexture`, as in Vercel's Ship 2024 badge). Client component (`'use client'`) loaded with `next/dynamic` and `ssr: false`, after the page is ready. Below 768 px or with reduced motion: a flat HTML version of the same card.
4. **Skills + Journey + motion:** periodic-table tiles with filter chips and detail panel; vertical timeline; gentle fade-up on scroll with Motion.
5. **SEO, GEO, performance:** see section 8.
6. **Deploy and check:** push, deploy on Vercel, run Lighthouse in mobile mode, fix the top problems, write a README that says which parts were AI-assisted and credits React Bits and Vercel's badge write-up.

## 8. SEO, GEO and performance

- Metadata API: title "Gogada Prameela – ECE Student | Software & Embedded Projects", one-sentence description (~150 characters), canonical URL, Open Graph + Twitter card (1200×630 image made from `avatar-full.webp` with her name and role; `app/opengraph-image` is fine), favicon from initials "GP".
- `app/sitemap.ts` and `app/robots.ts`; robots allows GPTBot, ClaudeBot, PerplexityBot and Google-Extended.
- Person JSON-LD: name, role, college (alumniOf), location, `sameAs` LinkedIn and GitHub.
- One `h1` (her name), section headings `h2` in order; important words as real text, not only in images or video; transcript under the video.
- `public/llms.txt`: short Markdown summary of her, the project and links to each section (a proposed convention; a bonus, not a requirement).
- Performance targets on mobile (Core Web Vitals "good"): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Poster via `next/image` with `priority`; fonts via `next/font`; 3D and Motion client-only after load; images WebP.
- Lighthouse mobile: SEO, Accessibility, Best Practices 90+; Performance 80+ with the 3D card.
- After launch (she does this): Google Search Console, submit the sitemap, request indexing.

## 9. Rules

- One change per step; keep the site working; explain changes simply.
- Never use the other GitHub account; never commit `portfolio-assets\source`.
- No invented facts, numbers, courses or achievements: leave a visible TODO and ask.
- Keep the "AI-generated intro" note and the README's AI-assistance note.
