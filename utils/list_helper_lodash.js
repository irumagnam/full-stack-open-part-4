const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return _.sumBy(blogs, 'likes')
}

const favoriteBlog = (blogs) => {
  return _.maxBy(blogs, 'likes')
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return
  }
  const counts = _.countBy(blogs, 'author')
  console.log(counts)
  const authorWithMostBlogs = _.maxBy(_.keys(counts), a => counts[a])
  return {
    author: authorWithMostBlogs,
    blogs: counts[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return
  }
  const groupByAuthor = _.groupBy(blogs, 'author')
  const sumByLikes = _.map(groupByAuthor, (blogs, author) => {
    return {
      author: author,
      likes: _.sumBy(blogs, 'likes')
    }
  })
  return _.maxBy(sumByLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}