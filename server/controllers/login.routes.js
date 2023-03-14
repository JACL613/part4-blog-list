const User = require('../../Databases/models/users.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const routerLogin = require('express').Router()

routerLogin.post('/', async (req, res) => {
  const body = req.body
  console.log(body)
  const user = await User.findOne({ username: body.username })
  console.log('el usuario query' , user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
  console.log('verify: ',passwordCorrect)
  if (!(user && passwordCorrect)) {
    console.log('entro en el problema')
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }
  
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  console.log('usuarios de token: ',userForToken)
  const token = jwt.sign(userForToken, process.env.SECRET)
  
  res.status(200).send({ token, username: user.username, name: user.name })
})
module.exports = {routerLogin}