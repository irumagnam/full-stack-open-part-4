const { totalLikes } = require('../utils/list_helper_lodash')

describe('total likes', () => {
  const blogs = [
    { title: 't1', author: 'a1', url: 'u1', likes: 198 },
    { title: 't2', author: 'a2', url: 'u2', likes: 298 },
    { title: 't3', author: 'a2', url: 'u3', likes: 398 },
    { title: 't4', author: 'a3', url: 'u4', likes: 498 },
    { title: 't5', author: 'a3', url: 'u5', likes: 598 },
    { title: 't6', author: 'a3', url: 'u6', likes: 698 },
  ]

  test('is 0 if list has zero blogs', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('is first record likes if list has only one blog', () => {
    expect(totalLikes([blogs[0]])).toBe(198)
  })

  test('is n if list has many blogs', () => {
    expect(totalLikes(blogs)).toBe(2688)
  })

})