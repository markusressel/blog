export default async ($content, slug, error) => {
  const page = await $content(slug)
    .fetch()
    .catch(() => {
      error({ statusCode: 404, message: 'Page not found' })
    })

  return {
    page,
  }
}
