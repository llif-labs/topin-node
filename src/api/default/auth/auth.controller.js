import {Router} from 'express'

const AuthController = Router()

AuthController.post('/login', (req, res) => {
  res.send('dd')
})

AuthController.post('/register', (req, res) => {

})

export default AuthController
