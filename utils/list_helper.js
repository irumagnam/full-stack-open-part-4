const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(b => b.likes)
    .reduce((a,b) => a+b, 0)
}

const favoriteBlog = (blogs) => {
  // first find max likes
  const maxLikes = Math.max(...blogs.map(b => b.likes))
  // find first record that has max likes
  return blogs.find(b => b.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  let authorWithMostBlogs = undefined
  const blogCounts = []
  blogs.forEach(b => {
    const count = (blogCounts[b.author] | 0) + 1
    blogCounts[b.author] = count
    if (authorWithMostBlogs === undefined || count > authorWithMostBlogs.blogs) {
      authorWithMostBlogs = {
        author: b.author,
        blogs: count
      }
    }
  })
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  let authorWithMostLikes = undefined
  const likeCounts = []
  blogs.forEach(b => {
    const count = (likeCounts[b.author] | 0) + b.likes
    likeCounts[b.author] = count
    if (authorWithMostLikes === undefined || count > authorWithMostLikes.likes) {
      authorWithMostLikes = {
        author: b.author,
        likes: count
      }
    }
  })
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}