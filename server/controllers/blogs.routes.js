const routerBlog = require('express').Router()
const   Blog = require('../../Databases/models/blogs.models')
const User = require('../../Databases/models/users.models')
const jwt = require('jsonwebtoken')



routerBlog.get('/',async (request, response) => {
  const respuesta = await Blog.find({})
  if (!respuesta) {
    response.status(400).end()
  }
  response.send(respuesta).status(200)
  
})

routerBlog.post('/', async (req, res) => {
  const {title , author,url, likes , userId , token} = req.body
  if (!token || token == undefined) {
    console.log('no hay')
    return res.status(401).json({ error: 'Unauthorized token missing or invalid' }).end()
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'Unauthorized token missing or invalid' })
  }
  if (title && author && url && likes && userId ) {
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({title , author , url , likes , user: user._id})
    
    const respuesta = await blog.save()
    if (!respuesta) {
      res.status(400).end()
    }
    user.blogs = user.blogs.concat(respuesta._id)
    await user.save()
    res.send(respuesta)
    
  }
  res.status(400).end()

  
  
})

routerBlog.delete('/:id' , async (req , res) => {
 
  
  const respuesta = await Blog.findByIdAndDelete({_id:req.params.id})
  if (!respuesta) {
    res.status(400).end()
  }
  res.send(respuesta).status(200)
})
routerBlog.put('/likes/:id', async (req ,  res) => {
  const {id} = req.params
  const {title , author ,url, likes} = req.body
  const respuesta = await Blog.findByIdAndUpdate({_id: id} , {title , author, url, likes: likes + 1})
  if (!respuesta) {
    res.status(400).end()
  }
  const comprobacion = await Blog.findById({_id:id})
  res.send(comprobacion).status(200)

})

module.exports = { routerBlog }