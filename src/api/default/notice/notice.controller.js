import {Router} from 'express'
import NoticeService from './notice.service.js'

const NoticeController = Router()

NoticeController.get('/', NoticeService.getAll)
NoticeController.get('/detail/:id', NoticeService.getOne)

export default NoticeController
