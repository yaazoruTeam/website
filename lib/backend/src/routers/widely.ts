import { Router } from 'express'
import * as widelyController from '../controller/widely'
import { hasRole } from '../middleware/auth'

const widelyRouter = Router()

widelyRouter.post('/search_users', hasRole('admin'), widelyController.searchUsers)
widelyRouter.post('/get_mobiles', hasRole('admin'), widelyController.getMobiles)
widelyRouter.post('/get_mobile_info', hasRole('admin'), widelyController.getMobileInfo)
widelyRouter.post('/get_all_user_data', hasRole('admin'), widelyController.getAllUserData)
widelyRouter.post('/terminate_mobile', hasRole('admin'), widelyController.terminateMobile)

export default widelyRouter
