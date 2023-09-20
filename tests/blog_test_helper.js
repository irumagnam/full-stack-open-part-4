const User = require('../models/user')
const Blog = require('../models/blog')
const security = require('../utils/security')

const initialUsers = [
  {
    username: 'michaelchan',
    name: 'Michael Chan',
    password: 'nahcleahcim',
    blogs: [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      }
    ]
  },
  {
    username: 'tylercowen',
    name: 'Tyler Cowen',
    password: 'newocrelyt',
    blogs: [
      {
        title: 'Marginal Revolution',
        author: 'Tyler Cowen',
        url: 'https://feeds.feedblitz.com/marginalrevolution',
        likes: 9,
      }
    ]
  }
]

const newUser = {
  username: 'kevinkelly',
  name: 'Kevin Kelly',
  password: 'ylleknivek',
  blogs: [
    {
      title: 'The Technium',
      author: 'Kevin Kelly',
      url: 'https://feedpress.me/TheTechnium',
      likes: 11,
    }
  ]
}

const initialBlogs = initialUsers.map(user => user.blogs)
const newBlog = newUser.blogs[0]

const newBlogNoAuthor = {
  title: newBlog.title,
  url: newBlog.url,
}

const newBlogNoTitle = {
  author: newBlog.author,
  url: newBlog.url,
}

const newBlogNoUrl = {
  title: newBlog.title,
  author: newBlog.author,
}

const setupInitialData = async () => {
  // clean everything first
  await User.deleteMany({})
  await Blog.deleteMany({})

  // setup initial data
  for(let user of initialUsers) {
    // save user
    const passwordHash = await security.hashText(user.password)
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash: passwordHash
    })
    const savedUser = await newUser.save()

    // save user blogs
    const blogs = user.blogs.map(blog => ({
      ...blog, user: savedUser._id.toString()
    }))
    const savedBlogs = await Blog.insertMany(blogs)

    // update user with blog ids
    savedUser.blogs = savedBlogs.map(blog => blog._id)
    await User.findByIdAndUpdate(savedUser._id, savedUser)
    console.log(savedUser)
    console.log(savedBlogs)
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  newUser,
  newBlog,
  newBlogNoAuthor,
  newBlogNoTitle,
  newBlogNoUrl,
  setupInitialData,
  usersInDb,
  blogsInDb,
}