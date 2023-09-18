const { mostLikes } = require('../utils/list_helper_lodash')

describe('author with most likes', () => {
  const blogs = [
    { title: 't1', author: 'a1', url: 'u1', likes: 198 },
    { title: 't2', author: 'a2', url: 'u2', likes: 298 },
    { title: 't3', author: 'a2', url: 'u3', likes: 398 },
    { title: 't4', author: 'a3', url: 'u4', likes: 498 },
    { title: 't5', author: 'a3', url: 'u5', likes: 598 },
    { title: 't6', author: 'a3', url: 'u6', likes: 698 },
  ]

  test('is empty if list has zero blogs', () => {
    expect(mostLikes([]))
      .toEqual(undefined)
  })

  test('is first author if list has only one blog', () => {
    expect(mostLikes([blogs[0]]))
      .toEqual({ author: 'a1', likes: 198 })
  })

  test('is author3 because that author has most blogs', () => {
    expect(mostLikes(blogs))
      .toEqual({ author: 'a3', likes: 1794 })
  })

})