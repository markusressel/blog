import {
  queryCollection,
  queryCollectionSearchSections,
} from '@nuxt/content/server'

// A small full-text search index of all articles, prerendered at build time.
// The search in the header loads it on first use, instead of the SQLite engine
// that client-side content queries would need.
export default defineEventHandler(async (event) => {
  let articlesQuery = queryCollection(event, 'articles').select(
    'path',
    'title',
    'description',
  )
  // placeholder articles (`dummy: true`) are only searchable during development
  if (!import.meta.dev) {
    articlesQuery = articlesQuery.where('dummy', '=', false)
  }
  const articles = await articlesQuery.all()
  const sections = await queryCollectionSearchSections(event, 'articles')

  const byPath = new Map(articles.map((article) => [article.path, article]))

  return {
    articles: articles.map((article) => ({
      slug: article.path.split('/').pop(),
      title: article.title,
      description: article.description,
    })),
    sections: sections
      .map((section) => {
        const [path, hash] = section.id.split('#')
        const article = byPath.get(path as string)
        if (!article) {
          return null
        }
        return {
          id: section.id,
          slug: article.path.split('/').pop(),
          hash: hash ?? '',
          title: section.title,
          titles: section.titles.join(' '),
          content: section.content,
        }
      })
      .filter((section) => section !== null),
  }
})
