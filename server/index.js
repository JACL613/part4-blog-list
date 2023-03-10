require('dotenv').config()
require('../Databases/connection.mongo')
const express = require('express')
const morgan = require('morgan')
const app = express()
const {routerBlog} = require('./controllers/blogs.routes')
const {routerUser} = require('./controllers/users.routes')
const cors = require('cors')

// configuracion morgan token body 
morgan.token('body' , (req) => JSON.stringify(req.body))

// middelware 
app.use(morgan(':method :url :status :response-time ms :res[content-length] - :body'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users' , routerUser)
app.use('/api/blogs' , routerBlog)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {server , app}