export default async ($content, params, error) => {
  const currentPage = parseInt(params.page)
  const perPage = 5

  const tmp = await $content('articles').fetch()
  const allArticles = []
  for (const item of tmp) {
    const article = await $content('articles', item.slug).fetch()
    console.log('Article: ' + article)
    const tagsList = await $content('tags')
      .only(['name', 'slug'])
      .where({ name: { $containsAny: article.tags } })
      .fetch()
    const tags = Object.assign({}, ...tagsList.map((s) => ({ [s.name]: s })))
    article.tags = tags
    allArticles.push(article)
  }

  const totalArticles = allArticles.length

  // use Math.ceil to round up to the nearest whole number
  const lastPage = Math.ceil(totalArticles / perPage)

  // use the % (modulus) operator to get a whole remainder
  const lastPageCount = totalArticles % perPage

  const skipNumber = () => {
    if (currentPage === 1) {
      return 0
    }
    if (currentPage === lastPage) {
      return totalArticles - lastPageCount
    }
    return (currentPage - 1) * perPage
  }

  const paginatedArticles = await $content('articles')
    .only([
      'slug',
      'title',
      'description',
      'image',
      'author',
      'published',
      'updatedAt',
    ])
    .sortBy('published', 'desc')
    .limit(perPage)
    .skip(skipNumber())
    .fetch()

  if (currentPage === 0 || !paginatedArticles.length) {
    return error({ statusCode: 404, message: 'No articles found!' })
  }

  return {
    allArticles,
    paginatedArticles,
  }
}
