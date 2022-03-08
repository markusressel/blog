export default async ($content, searchQuery, tags, limit, page) => {
  let currentPage
  if (page !== null) {
    currentPage = parseInt(page)
  } else {
    currentPage = null
  }
  const perPage = 5

  let tmp = $content('articles')
  if (searchQuery !== null) {
    tmp = tmp.search(searchQuery)
  }
  if (limit !== null) {
    tmp = tmp.limit(limit)
  }

  tmp = await tmp.fetch()
  const allArticles = []
  for (const item of tmp) {
    if (
      process.env.NODE_ENV === 'production' &&
      item.dummy !== undefined &&
      item.dummy === true
    ) {
      continue
    }

    const article = await $content('articles', item.slug).fetch()

    // filter articles by tag
    if (tags instanceof Array) {
      const tagNames = article.tags.map((x) => x.toLowerCase())
      if (!tags.some((r) => tagNames.includes(r.toLowerCase()))) {
        continue
      }
    }

    const authorsList = await $content('authors')
      .where({ name: { $containsAny: article.authors } })
      .fetch()
    const authors = Object.assign(
      {},
      ...authorsList.map((s) => ({ [s.name]: s }))
    )
    article.authors = authors

    allArticles.push(article)
  }

  const sortedArticles = allArticles.sort(function (a, b) {
    const atime = new Date(a.createdAt)
    const btime = new Date(b.createdAt)
    return btime - atime
  })

  let start = 0
  if (!isNaN(currentPage)) {
    start = (currentPage - 1) * perPage
  }
  const end = start + perPage
  const paginatedArticles = sortedArticles.slice(start, end)

  return {
    allArticles,
    paginatedArticles,
  }
}
