import { queryCollection } from '@nuxt/content/server'

const SITE_URL = 'https://markusressel.de'
const TITLE = "Markus' Blog"

const escape = (text = '') =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// RSS feed of all articles, prerendered at build time
export default defineEventHandler(async (event) => {
  let query = queryCollection(event, 'articles')
    .select('path', 'title', 'description', 'createdAt', 'tags')
    .order('createdAt', 'DESC')
  // placeholder articles (`dummy: true`) are only listed during development
  if (!import.meta.dev) {
    query = query.where('dummy', '=', false)
  }
  const articles = await query.all()

  const items = articles.map((article) => {
    const url = `${SITE_URL}/blog/post/${article.path.split('/').pop()}/`
    return `    <item>
      <title>${escape(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(article.createdAt as string).toUTCString()}</pubDate>
      <description>${escape(article.description)}</description>
${(article.tags ?? []).map((tag) => `      <category>${escape(tag)}</category>`).join('\n')}
    </item>`
  })

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE_URL}/blog/</link>
    <description>Articles about Linux, ZFS, home automation and software development.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`
})
