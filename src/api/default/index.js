import {Router} from 'express'
import AuthController from './auth/auth.controller.js'
import IssueController from './issue/issue.controller.js'
import PostController from './post/post.controller.js'

const DefaultRouter = Router()

DefaultRouter.use('/auth', AuthController)
DefaultRouter.use('/issue', IssueController)
DefaultRouter.use('/issue/post', PostController)

export default DefaultRouter
