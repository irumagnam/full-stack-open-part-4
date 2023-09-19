const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const newBlog = {
  title: 'Marginal Revolution',
  author: 'Tyler Cowen',
  url: 'https://feeds.feedblitz.com/marginalrevolution',
}

const newBlogNoAuthor = {
  title: 'Marginal Revolution',
  url: 'https://feeds.feedblitz.com/marginalrevolution',
}

const newBlogNoTitle = {
  author: 'Tyler Cowen',
  url: 'https://feeds.feedblitz.com/marginalrevolution',
}

const newBlogNoUrl = {
  title: 'Marginal Revolution',
  author: 'Tyler Cowen',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  newBlog,
  newBlogNoAuthor,
  newBlogNoTitle,
  newBlogNoUrl,
  blogsInDb,
}