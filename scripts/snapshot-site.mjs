// Extracts a markup-agnostic JSON snapshot of every page in a generated site.
//
// Used to verify the Nuxt 2 -> Nuxt 4 / @nuxt/content v1 -> v3 migration: run it
// against the old and the new `dist/` and diff the results. Only content that
// readers (and search engines) see is recorded, not the exact markup, so
// differences in highlighting or wrapper elements do not show up as changes.
//
// Usage: node scripts/snapshot-site.mjs <dist-dir> <out-dir>

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join, relative, sep } from 'path'
import { parse } from 'node-html-parser'

// Elements wrapping the rendered markdown, old (v1) and new build.
// Add `data-snapshot="content"` to the wrapper in the new build.
const CONTENT_SELECTORS = ['[data-snapshot="content"]', '.nuxt-content']
const BLOCK_TAGS = ['p', 'li', 'td', 'th', 'dt', 'dd', 'blockquote', 'div']

const [distDir, outDir] = process.argv.slice(2)
if (!distDir || !outDir) {
  console.error('Usage: node scripts/snapshot-site.mjs <dist-dir> <out-dir>')
  process.exit(1)
}

const clean = (text) => text.replace(/\s+/g, ' ').trim()

const findHtmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === '_nuxt' ? [] : findHtmlFiles(path)
    }
    return entry.name === 'index.html' ? [path] : []
  })

const routeOf = (file) => {
  const route = relative(distDir, dirname(file)).split(sep).join('/')
  return '/' + route
}

// "2,5-6" -> [2, 5, 6]
const parseLineRanges = (value) =>
  value.split(',').flatMap((part) => {
    const [start, end = start] = part.trim().split('-').map(Number)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

const isInside = (element, tagName) => {
  for (let node = element.parentNode; node; node = node.parentNode) {
    if (node.tagName === tagName) {
      return true
    }
  }
  return false
}

const snapshotMeta = (root) => {
  const meta = {}
  for (const element of root.querySelectorAll('meta')) {
    const key = element.getAttribute('property') || element.getAttribute('name')
    if (key && /^(description|og:|twitter:)/.test(key)) {
      meta[key] = element.getAttribute('content') ?? ''
    }
  }
  return Object.fromEntries(Object.entries(meta).sort())
}

const snapshotCodeBlock = (pre) => {
  const code = pre.querySelector('code') ?? pre
  const classes = `${pre.getAttribute('class') ?? ''} ${code.getAttribute('class') ?? ''}`
  const language =
    pre.getAttribute('data-language') ??
    classes.match(/language-([\w-]+)/)?.[1] ??
    null

  const filename =
    pre.getAttribute('data-filename') ??
    pre.parentNode
      ?.querySelectorAll('.filename')
      .find((element) => element.parentNode === pre.parentNode)?.text ??
    null

  // v1/Prism: data-line="2,5-6" on <pre>; Shiki: <span class="line highlight">
  const highlights = pre.getAttribute('data-line')
    ? parseLineRanges(pre.getAttribute('data-line'))
    : code
        .querySelectorAll('.line')
        .map((line, index) =>
          line.classList.contains('highlight') ? index + 1 : null,
        )
        .filter((line) => line !== null)

  return {
    language,
    filename: filename && clean(filename),
    highlights,
    code: code.text.replace(/\n+$/, ''),
  }
}

const snapshotContent = (content) => {
  // controls like a copy button are not content
  content.querySelectorAll('button').forEach((button) => button.remove())

  const blocks = content
    .querySelectorAll(BLOCK_TAGS.join(','))
    .filter((element) => !isInside(element, 'pre'))
    // keep only innermost blocks so nested text is recorded once
    .filter((element) => !element.querySelector(BLOCK_TAGS.join(',')))
    .map((element) => clean(element.text))
    .filter((text) => text.length > 0)

  return {
    headings: content.querySelectorAll('h1,h2,h3,h4,h5,h6').map((heading) => ({
      level: Number(heading.tagName[1]),
      id: heading.getAttribute('id') ?? null,
      text: clean(heading.text),
    })),
    codeBlocks: content.querySelectorAll('pre').map(snapshotCodeBlock),
    images: content.querySelectorAll('img').map((image) => ({
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt') ?? null,
      title: image.getAttribute('title') ?? null,
    })),
    links: content
      .querySelectorAll('a[href]')
      .filter((link) => !link.getAttribute('href').startsWith('#'))
      .map((link) => ({
        href: link.getAttribute('href'),
        text: clean(link.text),
      })),
    blocks,
  }
}

const snapshotPage = (file) => {
  // parse <pre> as markup; node-html-parser keeps it as raw text by default
  const root = parse(readFileSync(file, 'utf8'), {
    blockTextElements: { script: true, noscript: true, style: true },
  })
  const content = CONTENT_SELECTORS.map((selector) =>
    root.querySelector(selector),
  ).find(Boolean)

  const internalLinks = root
    .querySelectorAll('a[href^="/"]')
    .map((link) => link.getAttribute('href').replace(/\/$/, '') || '/')
  const tocLinks = root.querySelectorAll('nav a[href^="#"]').map((link) => ({
    href: link.getAttribute('href'),
    text: clean(link.text),
  }))

  return {
    route: routeOf(file),
    title: clean(root.querySelector('title')?.text ?? ''),
    meta: snapshotMeta(root),
    h1: root.querySelectorAll('h1').map((heading) => clean(heading.text)),
    internalLinks: [...new Set(internalLinks)].sort(),
    toc: tocLinks,
    content: content ? snapshotContent(content) : null,
  }
}

const snapshotSitemap = () => {
  try {
    const xml = readFileSync(join(distDir, 'sitemap.xml'), 'utf8')
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
      match[1].replace(/\/$/, ''),
    )
    return urls.sort()
  } catch {
    return null
  }
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const pages = findHtmlFiles(distDir).map(snapshotPage)
for (const page of pages) {
  const name =
    page.route === '/' ? 'index' : page.route.slice(1).replaceAll('/', '__')
  writeFileSync(
    join(outDir, `${name}.json`),
    JSON.stringify(page, null, 2) + '\n',
  )
}

writeFileSync(
  join(outDir, '_site.json'),
  JSON.stringify(
    {
      routes: pages.map((page) => page.route).sort(),
      sitemap: snapshotSitemap(),
    },
    null,
    2,
  ) + '\n',
)

const missing = pages.filter(
  (page) =>
    page.route.startsWith('/blog/post/') &&
    page.route !== '/blog/post' &&
    !page.content,
)
for (const page of missing) {
  console.warn(`warning: no content element found on ${page.route}`)
}
console.log(`Wrote ${pages.length} page snapshots to ${outDir}`)
