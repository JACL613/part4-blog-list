require('dotenv').config()
require('../Databases/connection.mongo')
const express = require('express')
const morgan = require('morgan')
const app = express()
require('express-async-errors')
const {routerBlog} = require('./controllers/blogs.routes')
const {routerUser} = require('./controllers/users.routes')
const {routerLogin} = require('./controllers/login.routes')
const cors = require('cors')
const middleware = require('../utils/middleware')


// configuracion morgan token body 
morgan.token('body' , (req) => JSON.stringify(req.body))

// middelware 
app.use(morgan(':method :url :status :response-time ms :res[content-length] - :body'))
app.use(cors())
app.use(express.json())
app.use(middleware.getTokenFrom)
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)


// Routes
app.use('/api/users',middleware.userExtractor , routerUser)
app.use('/api/blogs' , routerBlog)
app.use('/api/login' , routerLogin)

// middleware errors
app.use(middleware.unknownEndpoint)
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {server , app}