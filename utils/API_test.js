const {app , server} = require('../server/index')
const supertest = require('supertest')
const api = supertest(app)

module.exports = {
  api
}
