export default async (articles) => {
  return articles.filter((keyword, index) => {
    if (!process.env.NODE_ENV === 'production') {
      return true
    } else {
      return articles[index].dummy === undefined || articles[index].dummy === false
    }
  })
}