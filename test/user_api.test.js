const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../Databases/models/users.models')
const helper = require('../utils/list_helpers')
const {api} = require('../utils/API_test')
const { server} = require('../server/index')


describe('when there is initially one user in db', () => {

  jest.setTimeout(15000)

  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'alex', passwordHash })

    await user.save()
  })
  test('Session Startup Test',async () => { 
    const respuesta = await api
      .post('/api/login')
      .send({username: 'root' , password: 'sekret'})
      .expect(200)
    console.log(respuesta.body)
    expect(respuesta.body.name).toContain('alex')
    
    
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('username to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })



  afterAll(async() => {
    await server.close()
    await mongoose.connection.close()
  })
}, 10000  )
