import getContent from '@/utils/getContent'

export default async ($content, error, slug) => {
  const article = await getContent($content, error, 'articles', slug)

  // fetch author data
  const authorsList = await $content('authors')
    .where({ name: { $containsAny: article.authors } })
    .fetch()
  const authors = Object.assign(
    {},
    ...authorsList.map((s) => ({ [s.name]: s })),
  )
  article.authors = authors

  return article
}
