import getContent from '@/utils/getContent'

export default async ($content, error, slug) => {
  return await getContent($content, error, 'articles', slug)
}
