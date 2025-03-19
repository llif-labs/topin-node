import {Router} from 'express'
import AuthController from './auth/auth.controller.js'

const DefaultRouter = Router()

DefaultRouter.use('/auth', AuthController)

export default DefaultRouter
