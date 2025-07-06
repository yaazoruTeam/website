import { Router } from 'express'
import * as widelyController from '../controller/widely'
import { hasRole } from '../middleware/auth'

const widelyRouter = Router()

widelyRouter.post('/', hasRole('admin'), widelyController.searchUsers)

export default widelyRouter
