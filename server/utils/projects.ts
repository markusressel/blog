import sharp from 'sharp'

const GITHUB_USER = 'markusressel'

// badges and build status images are not useful as a preview
const IGNORED_IMAGE =
  /badge|shields\.io|travis-ci|codeclimate|codebeat|codecov/i

const PREVIEW_WIDTH = 640
const PREVIEW_HEIGHT = 320

export type Project = {
  name: string
  html_url: string
  description: string | null
  archived: boolean
  language: string | null
  license: { spdx_id: string }
  stargazers_count: number
  watchers_count: number
  forks_count: number
  // path of the resized preview image, if the README has a usable one
  preview: string | null
}

type Repo = Omit<Project, 'preview' | 'license'> & {
  full_name: string
  default_branch: string
  fork: boolean
  license: { spdx_id: string } | null
}

// Image URLs in a README (Markdown images and HTML <img> tags), in order.
// Relative paths are resolved against the raw files of the repository.
const findImages = (readme: string, rawBase: string) =>
  [
    ...readme.matchAll(
      /!\[[^\]]*\]\(\s*<?([^)\s>]+)|<img[^>]*?src=["']([^"']+)/g,
    ),
  ]
    .map((match) => (match[1] ?? match[2]) as string)
    .filter((url) => !IGNORED_IMAGE.test(url))
    .map((url) => new URL(url.replace(/^\//, ''), rawBase).href)

// Every preview is a PREVIEW_WIDTH x PREVIEW_HEIGHT image. Images with about the
// same aspect ratio fill it, others (logos, phone screenshots) are shown whole on
// a blurred, darkened copy of themselves.
const toPreview = async (image: Buffer) => {
  // high density, so SVG logos are rasterized sharply; first frame of GIFs only
  const source = () => sharp(image, { density: 300 })
  const { width = 1, height = 1 } = await source().metadata()
  const ratio = width / height
  const target = PREVIEW_WIDTH / PREVIEW_HEIGHT
  if (ratio > target * 0.8 && ratio < target * 1.25) {
    return source()
      .resize(PREVIEW_WIDTH, PREVIEW_HEIGHT, { fit: 'cover', position: 'top' })
      .webp({ quality: 80 })
      .toBuffer()
  }
  const background = await source()
    .resize(PREVIEW_WIDTH, PREVIEW_HEIGHT, { fit: 'cover' })
    .blur(24)
    .modulate({ brightness: 0.6 })
    .toBuffer()
  const foreground = await source()
    .resize(PREVIEW_WIDTH - 48, PREVIEW_HEIGHT - 48, { fit: 'inside' })
    .toBuffer()
  return sharp(background)
    .composite([{ input: foreground, gravity: 'center' }])
    .webp({ quality: 80 })
    .toBuffer()
}

const fetchImage = async (url: string) => {
  const response = await fetch(url)
  return response.ok ? Buffer.from(await response.arrayBuffer()) : null
}

const fetchPreview = async (repo: Repo) => {
  const rawBase = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`
  const readme = await fetch(`${rawBase}README.md`)
  const images = readme.ok ? findImages(await readme.text(), rawBase) : []
  // fall back to the social preview image GitHub generates for every repository
  images.push(`https://opengraph.githubassets.com/1/${repo.full_name}`)
  for (const url of images) {
    try {
      const image = await fetchImage(url)
      if (image) {
        return await toPreview(image)
      }
    } catch {
      // not an image sharp can read, try the next one
    }
  }
  return null
}

const loadProjects = async () => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  }
  // optional, raises the API rate limit on shared build machines
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const repos = await $fetch<Repo[]>(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
    { headers },
  )

  const previews = new Map<string, Buffer>()
  const projects = await Promise.all(
    repos
      .filter((repo) => !repo.fork && repo.license !== null)
      .map(async (repo): Promise<Project> => {
        const preview = await fetchPreview(repo).catch(() => null)
        if (preview) {
          previews.set(repo.name, preview)
        }
        return {
          name: repo.name,
          html_url: repo.html_url,
          description: repo.description,
          archived: repo.archived,
          language: repo.language,
          license: { spdx_id: repo.license!.spdx_id },
          stargazers_count: repo.stargazers_count,
          watchers_count: repo.watchers_count,
          forks_count: repo.forks_count,
          preview: preview ? `/project-previews/${repo.name}.webp` : null,
        }
      }),
  )
  return { projects, previews }
}

// Loaded once per build (or dev server start), shared by /projects.json and
// the preview images.
let cache: ReturnType<typeof loadProjects> | null = null
export const getProjects = () => {
  cache ??= loadProjects().catch((error) => {
    cache = null
    throw error
  })
  return cache
}
