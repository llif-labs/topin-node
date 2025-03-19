import {Router} from 'express'
import AuthService from './auth.service.js'

const AuthController = Router()

AuthController.post('/login', AuthService.login)
AuthController.post('/register', AuthService.register)

export default AuthController
