const {model , Schema} = require('mongoose')
const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (doc , returnObj) => {
    returnObj.id = returnObj._id
    delete returnObj._id
    delete returnObj.__v
  }
})
  
const Blog  = model('Blog', blogSchema)

module.exports = Blog