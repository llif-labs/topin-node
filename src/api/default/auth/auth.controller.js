import {Router} from 'express'
import AuthService from './auth.service.js'

const AuthController = Router()

AuthController.post('/login', AuthService.login)
AuthController.post('/verifyEmail', AuthService.verifyEmail)
AuthController.post('/register', AuthService.register)

AuthController.post('/find/email', AuthService.findEmail)
AuthController.get('/find/email/success', AuthService.findEmailSuccess)

AuthController.post('/find/password', AuthService.findPassword)
AuthController.patch('/find/password/success', AuthService.findPasswordSuccess)

export default AuthController
