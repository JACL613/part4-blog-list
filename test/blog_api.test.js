const mongoose = require('mongoose')
const {blogs} = require('../utils/list_blogs')
const  Blog  = require('../Databases/models/blogs.models')
const  User  = require('../Databases/models/users.models')
const {api} = require('../utils/API_test')
const { server} = require('../server/index')




describe('Test server endpoints', () => {
  jest.setTimeout(1600)
  let user
  let userForToken
  beforeAll(async () => {
    await Blog.deleteMany({})
    user = await User.find({username: 'root'})
    console.log(user)
    blogs.map(async (item) => {
      const blog = new Blog({...item , user: user[0]._id})
      await blog.save()
    })
    await api.get('/api/blogs')

    const login = await api
      .post('/api/login')
      .send({username: 'root' , password: 'sekret'})
    userForToken = login.body
  })

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
      userId: user[0]._id
    }
    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${userForToken.token}` })
      .send(blog)
    const respuesta = await api.get('/api/blogs') 
    expect(respuesta.body).toHaveLength(blogs.length + 1)

  })
  test('bad request new blog without authorization', async () => { 
    const respuesta =  await api
      .post('/api/blogs')
      .set({ Authorization: 'Bearer ' })
      .send(blogs[1])
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(respuesta.body.error).toContain('Unauthorized ')
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
      .set({ Authorization: `Bearer ${userForToken.token}` })   
      .send(blog)
      .expect(400)

  })
  test('Testing functionality to delete resources', async () => { 
    const resBlogs = await api.get('/api/blogs')
    await api
      .delete(`/api/blogs/${resBlogs.body[0].id}`)
      .set({Identification: resBlogs.body[0].id})
      .set({ Authorization: `Bearer ${userForToken.token}` })
      .expect(200)
  })
  test('Testing functionality to update resources', async () => { 
    const resBlogs = await api.get('/api/blogs')
    const respuesta = await api
      .put(`/api/blogs/likes/${resBlogs.body[0].id}`)
      .send(resBlogs.body[0])
      .expect(200)
    console.log(respuesta.body)
    expect(respuesta.body.likes).toBe(resBlogs.body[0].likes + 1)
  })
  
  afterAll( async() => {
    await server.close()
    await mongoose.connection.close()
  })
},)

