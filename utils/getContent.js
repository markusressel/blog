export default async ($content, error, folder, slug) => {
  const page = await $content(folder, slug)
    .fetch()
    .catch(() => {
      error({ statusCode: 404, message: 'Page not found' })
    });

  return page
}
