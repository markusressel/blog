# AGENTS.md

Guidance for AI coding agents working in this repository. Human-oriented docs live in `README.md`.

## Project overview

Personal website and blog of Markus Ressel, published at <https://markusressel.de>.

- Framework: **Nuxt 4** (Vue 3). `nuxt generate` pre-renders every page into a static site in `dist/`
  (locally a symlink to `.output/public`; on Netlify the `netlify-static` preset writes `dist/` directly).
- Content: **@nuxt/content v3**. Markdown files in `content/`, collections defined in `content.config.ts`,
  stored in SQLite at build time. Code highlighting is done by Shiki at build time.
- Styling: **Tailwind CSS 3** (`@nuxtjs/tailwindcss`) plus `app/assets/css/main.css`.
  Rendered Markdown uses `@tailwindcss/typography` (`prose dark:prose-invert`); code blocks opt out with `not-prose`.
  Fonts are the system font stack on purpose (no font download).
- Dark mode: `@nuxtjs/color-mode` sets the `dark-mode` class on `<html>`; Tailwind's `dark:` variant uses it.
- Hosting: **Netlify**, configured in `netlify.toml` (build command, publish dir, Node version).

Use Nuxt 4 / Vue 3 APIs: `<script setup>`, `useAsyncData`, `useHead`, `useSeoMeta`, `queryCollection`.
Do not use Nuxt 2 / Content v1 APIs (`asyncData`, `head()`, `$content`, `<nuxt-content>`).

## Setup and commands

Use **yarn** (v1), not npm. Node.js **22** is required (Nuxt 4.6 needs `^22.22.3`).

```bash
yarn install            # install dependencies (runs `nuxt prepare`)
yarn dev                # dev server with hot reload on http://localhost:3000
yarn generate           # build static site into .output/public (dist/)
yarn preview            # serve dist/ on http://localhost:3000
yarn generate:serve     # generate, then serve
yarn lint               # ESLint (flat config via @nuxt/eslint + Prettier)
yarn nuxt typecheck     # vue-tsc type check
yarn test:e2e:ci        # generate + serve + headless Cypress run (what CI runs)
yarn snapshot           # snapshot dist/ into test/site-snapshot/current
yarn snapshot:diff      # diff that snapshot against test/site-snapshot/baseline
```

The `Justfile` wraps these (`just --list`); `just check` runs lint, typecheck and Cypress like CI.

Before finishing a change, run `yarn lint` and `yarn nuxt typecheck`. For changes to pages,
components, `app/utils/` or content rendering, also run `yarn test:e2e:ci`.
For changes that affect how Markdown is rendered, also run `yarn generate && yarn snapshot && yarn snapshot:diff`.

## Repository layout

| Path                                    | Purpose                                                                                                                                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/pages/`                            | File-based routes. Blog: `app/pages/blog/` (`index.vue` and `page/[page].vue` for the paginated list, `post/[slug].vue`, `tags/`). `[...slug].vue` throws a 404, rendered by `app/error.vue`.                                                                                                          |
| `app/components/`                       | Vue components, auto-imported without path prefix. Component names must be unique across subfolders.                                                                                                                                                                                                   |
| `app/components/content/`               | Prose components that override how Markdown renders: `ProsePre.vue` (code blocks: filename, copy button, line numbers), `ProseH2-4.vue` (heading anchor links), `ProseImg.vue` (images resized at build time).                                                                                         |
| `app/layouts/default.vue`               | Only layout. The window scrolls; the header is sticky.                                                                                                                                                                                                                                                 |
| `app/utils/content.ts`                  | All content queries (`getArticles`, `getArticle`, `getTags`, `getPage`, ...). Reuse these instead of writing new queries in pages.                                                                                                                                                                     |
| `app/assets/`                           | CSS and SVG icons. Import icons as components with `?component` (nuxt-svgo).                                                                                                                                                                                                                           |
| `server/routes/`                        | Routes prerendered at build time: `search-index.json` (header search, loaded by `SearchInput.vue` on first use with MiniSearch), `feed.xml` (RSS), `projects.json` and `project-previews/` (GitHub projects with README preview images, see `server/utils/projects.ts`).                               |
| `content/`                              | Markdown: `articles/` (blog posts), `authors/`, and single pages (`home.md`, `impressum.md`, `privacy-policy.md`, `attributions.md`).                                                                                                                                                                  |
| `content.config.ts`                     | Content collections and front matter schemas (`articles`, `authors`, `pages`).                                                                                                                                                                                                                         |
| `public/`                               | Served as-is from the site root. Blog images go in `public/images/blog/<article-slug>/` (the header image as `header.jpg`). Always use local images: remote image URLs with a query string can't be prerendered into static files. `sw.js` removes the service worker of the old Nuxt 2 site; keep it. |
| `cypress/e2e/`                          | E2E tests (`*.cy.js`).                                                                                                                                                                                                                                                                                 |
| `scripts/snapshot-site.mjs`             | Extracts a markup-independent JSON snapshot of the generated site.                                                                                                                                                                                                                                     |
| `test/site-snapshot/baseline/`          | Reference snapshot. Regenerate with `yarn snapshot:baseline` only when a rendering change is intended.                                                                                                                                                                                                 |
| `.nuxt/`, `.output/`, `.data/`, `dist/` | Generated. Never edit or commit.                                                                                                                                                                                                                                                                       |

## Writing blog articles

Articles are Markdown files in `content/articles/<slug>.md`. The file name is the URL slug
(`/blog/post/<slug>`), so use lowercase kebab-case.

Front matter template:

```yaml
---
createdAt: 2024-01-31
updatedAt: 2024-01-31 # optional, falls back to createdAt
title: Human-readable title
img: /images/blog/<slug>/header.jpg # header image, stored in public/
alt: Alt text for the header image
authors:
  - Markus Ressel # must match `name` in content/authors/*.md
tags:
  - linux
  - zfs
---
Short teaser paragraph. It becomes the article description (list, search results, meta tags).

<!--more-->
## First section
```

Rules:

- Always set `createdAt`. It drives ordering in the list and prev/next navigation; there is no
  fallback to file modification times.
- `authors` entries must match the `name` field of a file in `content/authors/`.
- Tags are matched case-insensitively. Reuse existing tags where possible.
- Use `##` and `###` for sections. The table of contents is built from them.
- Code fences use MDC syntax: ` ```python [example.py] {2,5-6} ` (language, then filename in
  brackets, then highlighted lines in braces, separated by spaces). Add new languages to
  `content.build.markdown.highlight.langs` in `nuxt.config.ts`.
- `dummy: true` marks placeholder or unfinished posts (e.g. `dummy-post*.md`, `um34c-usb-tester.md`).
  They are shown in development and hidden in the generated site.
  Do not delete them. Never set `dummy: true` on a real article.
- The reading time is computed at build time (`content:file:afterParse` hook in `nuxt.config.ts`).
- New articles are prerendered automatically (`nitro.prerender.routes` in `nuxt.config.ts` lists
  every non-dummy file in `content/articles/`).

## Code style

- Formatting: Prettier (`.prettierrc`: no semicolons, single quotes) and `.editorconfig`
  (2-space indent, LF, final newline). CI runs Prettier on `**/*.{js,md,vue}` and pushes a
  "Prettified Code!" commit if files differ, so format locally to avoid noise.
- Linting: `eslint.config.mjs` (flat config from `@nuxt/eslint`, plus Prettier). CI runs it.
- New components use `<script setup>`. Some older components still use the Options API; that is fine.
- Prefer Tailwind utility classes over new custom CSS.
- Render images with `<NuxtImg>` (`@nuxt/image`, `ipx` provider) and `format="webp"`, so they are resized at build time.
- Import with the `~/` alias (points to `app/`), e.g. `import { getArticles } from '~/utils/content'`.

## Testing

- E2E tests use Cypress against the generated site served at `http://localhost:3000` (`cypress.config.mjs`).
- Use `cy.visitHydrated(url)` (in `cypress/support/commands.ts`) before interacting with a page,
  so clicks are handled by Vue and not lost before hydration.
- Tests select elements by CSS class (e.g. `.article-list-item`, `.image-link-card`, `.filename`).
  Do not rename these classes without updating `cypress/e2e/`.
- `cypress/screenshots/`, `cypress/videos/`, and the Cypress example folders are generated
  artifacts. Do not commit them.

## Commits and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`,
  `docs:`, ...). `.github/semantic.yml` validates both the PR title and every commit.
- Dependency updates arrive via Dependabot as `fix(deps): bump ...`.
- Target branch is `master`.

## Deployment

Netlify builds and deploys the site using `netlify.toml`. Do not change it (build command,
publish dir, Node version) without being asked.

The build fetches the projects page from the GitHub API. An optional `GITHUB_TOKEN` environment
variable raises the rate limit; without GitHub the build still succeeds and the page loads the
list in the browser. Redirects go in `public/_redirects`, not `netlify.toml`.
