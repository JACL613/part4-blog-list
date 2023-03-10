const User = require('../Databases/models/users.models')
const dummy = (blogs) => {
  return blogs.length
}  

const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => {
    return blog.likes
  })

  return likes.reduce((accu ,curr) => {
    return accu + curr
  } , initial = 0)
}

const favoriteBlog = (blogs) => {
  const result = blogs.filter(function(element, index, array){
    if ( element.likes > this.value ) {
      this.value = element.likes
    }
    return this.value === element.likes ? element : null
  }, {value: 0})
  return result[result.length - 1]
}

const mostBlog = (blogs) => {
  const nombres = blogs.map(b => b.author)
  const unificar = nombres.filter((item,index)=>{
    return nombres.indexOf(item) === index
  })

  const authors = unificar.map(a => {return{'author': a , blogs: 0}})


  blogs.map(b => {
    return authors.map(a => { return b.author === a.author ? a.blogs += 1: a})
  })
  const elderBlog = authors.filter(function(element, index, array){
    if ( element.blogs > this.value ) {
      this.value = element.blogs
    }
    return this.value === element.blogs ? element : null
  }, {value: 0})
  return elderBlog[elderBlog.length - 1]
}
const mostLikes = (blogs) => {
  const nombres = blogs.map(b => b.author)
  const unificar = nombres.filter((item,index)=>{
    return nombres.indexOf(item) === index
  })

  const authors = unificar.map(a => {return{'author': a , likes: 0}})


  blogs.map(b => {
    return authors.map(a => { return b.author === a.author ? a.likes += b.likes: a})
  })
  const elderBlog = authors.filter(function(element, index, array){
    if ( element.likes > this.value ) {
      this.value = element.likes
    }
    return this.value === element.likes ? element : null
  }, {value: 0})
  return elderBlog[elderBlog.length - 1]

}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes,
  usersInDb
}

