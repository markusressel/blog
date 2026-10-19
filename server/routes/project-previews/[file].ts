// Preview image of a project, taken from its README and resized at build time.
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'file')?.replace(/\.webp$/, '')
  const { previews } = await getProjects()
  const preview = name ? previews.get(name) : undefined
  if (!preview) {
    throw createError({ statusCode: 404 })
  }
  setResponseHeader(event, 'content-type', 'image/webp')
  return preview
})
