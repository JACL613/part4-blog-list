/* eslint-disable no-unreachable */
const logger = require('./logger')
const Blog = require('../Databases/models/blogs.models.js')
const jwt = require('jsonwebtoken')


const userExtractor = async (req , res ,next) => {
  if (req.method === 'DELETE') {
    const id = req.get('Identification')
    const {token} = req.body
    if (!token || token === undefined) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id ) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    console.log(id)
    
    const queryBlog = await Blog.findById({_id:id})
    if (!(queryBlog.user.toString() === decodedToken.id.toString())) {
      return res.status(401).json({ error: 'User for token invalid' })
    }
  }
  next()
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
const getTokenFrom = (request , response ,next) => {
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ') && authorization !== undefined) {
    request.body = { ...request.body , token: authorization.substring(7)}
  }
  return next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  } 
  next(error)
}   
module.exports = {
  userExtractor,
  getTokenFrom,
  requestLogger,
  unknownEndpoint,
  errorHandler
}