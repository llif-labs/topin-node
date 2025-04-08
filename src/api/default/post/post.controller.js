import {Router} from 'express'
import PostService from './post.service.js'
import {AuthMiddleware} from '../../../core/module/middleware/AuthMiddleware.js'

const PostController = Router()

PostController.get('/:issueId', PostService.getAll)
PostController.get('/get/:postId', PostService.getPost)

PostController.post('/:issueId', AuthMiddleware, PostService.write)
PostController.post('/:postId/reply/:issueId', AuthMiddleware, PostService.reply)

export default PostController
