<template>
  <Article :article="article" :prev="prev" :next="next" />
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    // fetch article data
    const article = await $content('articles', params.slug).fetch()

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

    // fetch the previous and next article
    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return {
      article,
      prev,
      next,
    }
  },
  head() {
    return {
      title: 'Post',
    }
  },
}
</script>
