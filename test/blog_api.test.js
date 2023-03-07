const mongoose = require('mongoose')
const supertest = require('supertest')
const {blogs} = require('../utils/list_blogs')
const { Blog } = require('../Databases/models/blogs.models')
const {app , server} = require('../server/index')

const api = supertest(app)
jest.setTimeout(100000)

beforeAll(async () => {
  await Blog.deleteMany({})
  blogs.map(async (item) => {
    const blog = new Blog({...item})
    await blog.save()
  })
  await api.get('/api/blogs')
}, 2000)

describe('Test server endpoints', () => {
  test('blogs are returned as json', async () => {
    const respuesta = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(respuesta.body).toHaveLength(blogs.length)
  } )

  test('Checking Unique ID Property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
  test('test new blog post', async () => { 
    const blog  = {
      title: 'Canonica',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }
    await api
      .post('/api/blogs')
      .send(blog)
    const respuesta = await api.get('/api/blogs') 
    expect(respuesta.body).toHaveLength(blogs.length + 1)

  })
  test('Checking Unique Likes Property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBeDefined()
  })
  test('test new blog post bad request', async () => { 
    const blog  = {
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    await api
      .post('/api/blogs')
      .send(blog)
      .expect(400)

  })
})


afterAll(() => {
  mongoose.connection.close()
  server.close()
})