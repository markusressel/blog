// GitHub projects for the projects page, fetched at build time. The page
// refreshes the numbers in the browser, see app/pages/projects/index.vue.
export default defineEventHandler(async () => {
  try {
    const { projects } = await getProjects()
    return projects
  } catch (error) {
    // don't fail the build when GitHub is unavailable, the page loads the list itself
    console.warn('Could not load projects from GitHub:', error)
    return []
  }
})
