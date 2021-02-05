<script>
export default {
  head() {
    return {
      title: 'Post',
    }
  },
  middleware({ redirect }) {
    return redirect('301', '/blog')
  },
}
</script>
<style scoped>
</style>