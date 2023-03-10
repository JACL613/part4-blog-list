const routerUser = require('express').Router()
const User = require('../../Databases/models/users.models')
const bcrypt = require('bcrypt')

routerUser.post('/' , async (req,res) => {
  const {body} = req
  const saltRounds = 10 
  const comprobacion = await User.find({username:body.username})
  if (comprobacion.length > 0 ) {
    res.status(400).json({error: `Error, expected username to be unique. Value: ${body.username}`}).end()
  }
  const passwordHash = await bcrypt.hash(body.password , saltRounds)
  const user = new User({
    username: body.username ,
    name: body.name,
    passwordHash
  })
  const saveUser = await user.save()
  console.log('saveUser: ' , saveUser)
  if (saveUser) {
    res.json(saveUser)
  }
  res.status(400)
})
module.exports = {routerUser}