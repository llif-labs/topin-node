import {Router} from 'express'
import AuthController from './auth/auth.controller.js'
import IssueController from './issue/issue.controller.js'
import PostController from './post/post.controller.js'
import {AuthMiddleware, CommonMiddleware} from '../../core/module/middleware/AuthMiddleware.js'
import ReportController from './report/report.controller.js'

const DefaultRouter = Router()

DefaultRouter.use('/auth', AuthController)
DefaultRouter.use('/issue', CommonMiddleware, IssueController)
DefaultRouter.use('/issue/post', CommonMiddleware, PostController)

DefaultRouter.use('/report', AuthMiddleware, ReportController)

export default DefaultRouter
