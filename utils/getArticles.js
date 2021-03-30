export default async ($content, searchQuery, limit, page, error) => {
  let currentPage
  if (page !== null) {
    currentPage = parseInt(page)
  } else {
    currentPage = null
  }
  const perPage = 5

  var tmp = await $content('articles').search(searchQuery).limit(limit).fetch()
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
    const tagsList = await $content('tags')
      .where({ name: { $containsAny: article.tags } })
      .fetch()
    const tags = Object.assign({}, ...tagsList.map((s) => ({ [s.name]: s })))
    article.tags = tags

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

  const totalArticles = allArticles.length

  // use Math.ceil to round up to the nearest whole number
  const lastPage = Math.ceil(totalArticles / perPage)

  // use the % (modulus) operator to get a whole remainder
  const lastPageCount = totalArticles % perPage

  const skipNumber = () => {
    if (currentPage === 1 || isNaN(currentPage)) {
      return 0
    }
    if (currentPage === lastPage) {
      return totalArticles - lastPageCount
    }
    return (currentPage - 1) * perPage
  }

  const sortedArticles = allArticles.sort(function (a, b) {
    let atime = new Date(a.createdAt)
    let btime = new Date(b.createdAt)
    return btime - atime
  })
  const paginatedArticles = sortedArticles.slice(
    skipNumber(),
    skipNumber() + perPage
  )

  if (currentPage === 0 || !paginatedArticles.length) {
    return error({ statusCode: 404, message: 'No articles found!' })
  }

  return {
    allArticles,
    paginatedArticles,
  }
}
