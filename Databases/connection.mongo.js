const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

  
let mongoUrl = process.env.DB_URI
 
if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.DB_TEST_URI
}
mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })