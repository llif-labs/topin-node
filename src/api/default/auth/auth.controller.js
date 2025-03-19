import {Router} from 'express'
import AuthService from './auth.service.js'

const AuthController = Router()

AuthController.post('/login', (req, res) => {
  res.send('dd')
})

AuthController.post('/register', AuthService.register)

export default AuthController
