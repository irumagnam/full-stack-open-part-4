const { favoriteBlog } = require('../utils/list_helper_lodash')

describe('favorite blog', () => {
  const blogs = [
    { title: 't1', author: 'a1', url: 'u1', likes: 198 },
    { title: 't2', author: 'a2', url: 'u2', likes: 298 },
    { title: 't3', author: 'a2', url: 'u3', likes: 398 },
    { title: 't4', author: 'a3', url: 'u4', likes: 498 },
    { title: 't5', author: 'a3', url: 'u5', likes: 598 },
    { title: 't6', author: 'a3', url: 'u6', likes: 698 },
  ]

  test('is undefined if list has zero blogs', () => {
    expect(favoriteBlog([]))
      .toEqual(undefined)
  })

  test('is first record if list has only one blog', () => {
    expect(favoriteBlog([blogs[0]]))
      .toEqual(blogs[0])
  })

  test('is blog3 if list has multiple records', () => {
    expect(favoriteBlog(blogs))
      .toEqual(blogs[5])
  })

})