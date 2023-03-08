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

routerBlog.delete('/:id' , async (req , res) => {
  const {id} = req.params
  console.log(id)
  const respuesta = await Blog.findByIdAndDelete({_id:id})
  if (respuesta) {
    res.send(respuesta).status(200)
  }
  res.status(400)
})
routerBlog.put('/likes/:id', async (req ,  res) => {
  const {id} = req.params
  const {title , author ,url, likes} = req.body
  const respuesta = await Blog.findByIdAndUpdate({_id: id} , {title , author, url, likes: likes + 1})
  console.log(respuesta)
  if (respuesta) {
    const comprobacion = await Blog.findById({_id:id})
    res.send(comprobacion).status(200)
  }
  res.status(400)

})

module.exports = { routerBlog }