const routerBlog = require('express').Router()
const {Blog} = require('../../Databases/models/blogs.models')
routerBlog.get('/',async (request, response) => {
  const respuesta = await Blog.find({})
  if (respuesta) {
    response.send(respuesta)
  }else{
    response.status(400)
  }
})
routerBlog.post('/', async (req, res) => {
  const {title , author,url, likes} = req.body

  if (!title || !author || !url || !likes) {
    res.status(400)
  }
  const blog = new Blog({title , author , url , likes})
  
  const respuesta = await blog.save()
  if (respuesta) {
    res.send(respuesta)
  }else{
    res.status(400)
  }
  
})

module.exports = { routerBlog }