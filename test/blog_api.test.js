const mongoose = require('mongoose')
const supertest = require('supertest')
const {app , server} = require('../server/index')

const api = supertest(app)
jest.setTimeout(6000)

describe('Test server endpoints', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
  })
})


afterAll(() => {
  mongoose.connection.close()
  server.close()
})