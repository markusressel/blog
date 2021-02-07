<script>
export default {
  middleware({ redirect }) {
    return redirect('301', '/blog')
  },
  head() {
    return {
      title: 'Post',
    }
  },
}
</script>
<style scoped></style>
