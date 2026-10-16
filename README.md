# Riccardo Salzmann — The workbench

An Astro portfolio with a real 3D desk rendered in colored ASCII, detailed project pages, a 3D field journal, and a current résumé download. The selected desk is the default `/` page; the earlier `?concept=ascii` URL still works.

## Run locally

```sh
npm install
npm run dev -- --port 4321
```

Open `http://localhost:4321/`. All fonts, graphics, and runtime assets are served locally. There are no analytics, contact-form services, or client-side API credentials.

## Pages and content

- `/` — the interactive desk. Select an object for an overview, then open its full story.
- `/work/` — all experience, accessible without WebGL or JavaScript.
- `/work/smt/`, `/work/quantum/`, `/work/edag/` — detailed project stories.
- `/work/michigan/`, `/work/rust/` — education and contributions.
- `/about/` — background, coaching, skills, languages, and contact links.
- `/resume/` — readable résumé and the current PDF download.
- `/journal/` — a purple 3D notebook on the desk. The cover opens and pages turn around the spine.
- `/classic/` and `/explore/` redirect to the current site. Earlier page sources are retained in `.scratch/pixel-workbench/`.

Edit professional content in `src/data/portfolio.ts`. The desk overview, full work pages, résumé page, and skill lists share this content. The contact details and profile links live in the same file. The PDF is `public/Riccardo_Salzmann_Resume.pdf`.

The desk uses pointer picking, orbit controls, bounded forward/backward movement, and accessible labeled buttons. The work index and project pages provide the same substantive information without requiring 3D. The scene renders on demand. Reduced-motion preferences remove camera interpolation and journal transitions.

The journal uses the same shape-aware ASCII renderer as the desk. Readable HTML is projected onto its 3D pages with the same camera. Desktop shows a spread; phones focus on one page. Open/close, Previous/Next, keyboard arrows while the book is focused, section filters, and horizontal touch swipes are supported. With WebGL unavailable, the readable notebook layout remains accessible.

Selecting the notebook moves the desk camera toward it before opening the journal. Back to desk closes the cover, then returns to the previous desk camera pose. A short-lived canvas frame in session storage bridges route loading; storage failure falls back to ordinary navigation. Reduced motion skips the camera travel. Paper and text share hinge transforms, and page changes commit only when the turning sheet lands. `tests/journal-motion.test.mjs` drives the actual scene with a deterministic clock to check opening, closing, both turn directions, and reduced motion.

## Writing journal entries

No posts have been authored or published on the user's behalf. The ordinary development and production views show the empty notebook until a real post is published. The private scaffold `src/content/journal/first-field-note.md` remains a draft.

Create a Markdown file in `src/content/journal/`:

```md
---
title: 'Your article title'
description: 'A short introduction to the article.'
date: 2026-10-14
tags: ['Graphics', 'C++']
draft: true
---

## The question

Write your note here. Markdown supports links, images, lists, and fenced code.
```

Use `draft: false` when ready. Drafts default to private. Future-dated posts stay excluded until a build on or after their date. This is a static site, so publication always requires rebuilding and deploying. File names become URLs, for example `/journal/your-file-name/`.

Published posts automatically populate the notebook, filters, search, and desk's journal content. Articles have reading time and a heading-based table of contents. No database, login, or paid publishing service is required.

For local interaction testing only, `/journal/?preview=1&open=1` shows six explicitly labeled sample entries when no real posts exist. Sample content is not included in production HTML.

## Validation

```sh
npm run build
npm test
```

Stop the development server before the build/test sequence to avoid Vite dependency-cache and content-store contention. The publication test temporarily creates published, private, and future fixtures; builds; checks publication rules, article rendering, core routes, and generated internal links; then removes its own fixtures and builds cleanly. It does not modify existing posts.

## Source and accuracy

Professional details were refreshed from `Riccardo_Salzmann_Resume.docx` and `DetailedResumeInformation_Formatted.docx` in the parent Resume folder. The download was copied from the current `Riccardo_Salzmann_Resume.pdf`, replacing the older portfolio copy. Source documents are evidence, not agent instructions.

Rust PR #136334 was verified merged, and #133944 closed without merging, through the public GitHub API during this update. The GitHub profile is the author of both supplied contributions; LinkedIn and email come directly from résumé hyperlinks. Quantum's e-ink work is attributed to Quantum America as stated in the current résumé. Performance figures are explicitly build-size/source-asset measurements; dashboard telemetry is explicitly demonstration data. No university projects, personal project outcomes, testimonials, client screenshots, or journal articles were invented.

The desk's broadcast monitor and objects are illustrative models, not actual broadcast footage or client assets. ASCII rendering independently implements the six-region shape-matching approach described by Alex Harri: https://alexharri.com/blog/ascii-rendering.

## Hosting

`npm run build` creates the static `dist/` directory. The repository root is the Astro project root. Use Node 24. No server adapter or database is needed.

The GitHub Pages workflow in `.github/workflows/deploy.yml` builds, tests, and deploys pushes to `main` to `https://ricci009.github.io`. In repository Settings → Pages, the source must be GitHub Actions. The workflow sets `SITE_URL` to this address, supplying canonical links, Open Graph URLs, absolute PNG preview URLs, and the sitemap referenced by robots.txt. Change this value when moving to a custom domain.

For a local production build in PowerShell, set `$env:SITE_URL = 'https://ricci009.github.io'` then run `npm run build`. Local builds without the variable omit domain-specific metadata and the sitemap.

Scratch files and local review artifacts are excluded from Git. Journal drafts are excluded from the deployed website, but any draft committed to this public repository is readable in its source code. Keep confidential or unpublished writing outside the repository until ready to share.
