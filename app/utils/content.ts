import type {
  ArticlesCollectionItem,
  AuthorsCollectionItem,
} from '@nuxt/content'

const PER_PAGE = 5

// fields shown in article lists, everything except the article body
const LIST_FIELDS = [
  'title',
  'path',
  'description',
  'img',
  'alt',
  'createdAt',
  'updatedAt',
  'authors',
  'tags',
  'readingTime',
] as const

// placeholder articles (`dummy: true`) are only shown during development
const articlesQuery = () => {
  const query = queryCollection('articles')
  return import.meta.dev ? query : query.where('dummy', '=', false)
}

type ArticleItem = Pick<ArticlesCollectionItem, 'path' | 'authors'> &
  Partial<ArticlesCollectionItem>

const toArticle = <T extends ArticleItem>(
  item: T,
  authors: AuthorsCollectionItem[],
) => ({
  ...item,
  slug: item.path.split('/').pop() as string,
  updatedAt: item.updatedAt ?? item.createdAt,
  authors: Object.fromEntries(
    authors
      .filter((author) => (item.authors ?? []).includes(author.name))
      .map((author) => [author.name, author]),
  ),
})

const withAuthors = async <T extends ArticleItem>(items: T[]) => {
  const names = [...new Set(items.flatMap((item) => item.authors ?? []))]
  const authors = names.length
    ? await queryCollection('authors').where('name', 'IN', names).all()
    : []
  return items.map((item) => toArticle(item, authors))
}

export const getArticle = async (slug: string) => {
  const item = await articlesQuery().path(`/articles/${slug}`).first()
  if (!item) {
    return null
  }
  const [article] = await withAuthors([item])
  return article
}

export const getArticles = async ({
  tags = null,
  page = null,
}: {
  tags?: string[] | null
  page?: number | null
} = {}) => {
  let items = await articlesQuery()
    .select(...LIST_FIELDS)
    .order('createdAt', 'DESC')
    .all()

  // filter articles by tag
  if (tags) {
    const wanted = tags.map((tag) => tag.toLowerCase())
    items = items.filter((item) =>
      (item.tags ?? []).some((tag) => wanted.includes(tag.toLowerCase())),
    )
  }

  const allArticles = await withAuthors(items)
  const start = ((page || 1) - 1) * PER_PAGE
  const paginatedArticles = allArticles.slice(start, start + PER_PAGE)

  return { allArticles, paginatedArticles }
}

export const getAdjacentArticles = async (slug: string) => {
  const items = await articlesQuery()
    .select('title', 'path', 'createdAt')
    .order('createdAt', 'ASC')
    .all()
  const index = items.findIndex((item) => item.path === `/articles/${slug}`)
  const toLink = (item?: { title: string; path: string }) =>
    item ? { title: item.title, slug: item.path.split('/').pop() } : null
  return {
    prev: index > 0 ? toLink(items[index - 1]) : null,
    next: index >= 0 ? toLink(items[index + 1]) : null,
  }
}

export const getTags = async () => {
  const items = await articlesQuery().select('tags').all()
  return [...new Set(items.flatMap((item) => item.tags ?? []))]
}

export const getPage = (name: string) =>
  queryCollection('pages').path(`/${name}`).first()
