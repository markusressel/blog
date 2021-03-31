import getContent from '@/utils/getContent'

export default async ($content, error, slug) => {
  const article = await getContent($content, error, 'articles', slug);

  // fetch tag data
  const tagsList = await $content('tags')
    .where({ name: { $containsAny: article.tags } })
    .fetch()
  const tags = Object.assign({}, ...tagsList.map((s) => ({ [s.name]: s })))
  article.tags = tags

  // fetch author data
  const authorsList = await $content('authors')
    .where({ name: { $containsAny: article.authors } })
    .fetch()
  const authors = Object.assign(
    {},
    ...authorsList.map((s) => ({ [s.name]: s }))
  )
  article.authors = authors

  return article
}
