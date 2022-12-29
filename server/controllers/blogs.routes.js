const routerBlog = require('express').Router()
const {Blog} = require('../../Databases/models/blogs.models')
routerBlog.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
routerBlog.post('/', (req, res) => {
  const {title , author,url, likes} = req.body
  const blog = new Blog({title , author , url , likes})
  
  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
})

module.exports = { routerBlog }