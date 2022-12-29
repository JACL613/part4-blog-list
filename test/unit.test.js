const { blogs } = require('../utils/list_blogs')
const {dummy , totalLikes , favoriteBlog , mostBlog , mostLikes} = require('../utils/list_helpers')


describe('units test blogs', () => {
  test('dummy returns one', () => {  
    const result = dummy(blogs)
    expect(result).toBe(blogs.length)
  })
  test('Rate Total Like', () => { 
    const result = totalLikes(blogs)
    expect(result).toBe(36)
  })
  test('Rate Favorite Blog', () => { 
    const result = favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
  test('Rate most blogs', () => { 
    const result = mostBlog(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin',
      blogs: 3})
  })
  test('Rate most likes', () => { 
    const result = mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
  
})