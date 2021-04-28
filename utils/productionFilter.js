export default async (articles) => {
  return articles.filter((keyword, index) => {
    if (
      process.env.NODE_ENV === 'production' &&
      articles[index].dummy !== undefined &&
      articles[index].dummy === true
    ) {
      return false
    } else {
      return true
    }
  })
}
