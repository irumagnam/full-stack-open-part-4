const { reverse } = require('../utils/for_testing')

test('reverse test a', () => {
  const result = reverse('a')
  expect(result).toBe('a')
})

test('reverse test react', () => {
  const result = reverse('react')
  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')
  expect(result).toBe('releveler')
})