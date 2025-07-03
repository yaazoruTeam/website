import { Router } from 'express'
import * as widelyController from '../controller/widely'
import { hasRole } from '../middleware/auth'

const widelyRouter = Router()

//לא משנה אם זה POST או GET  כי בפועל הקריאה ל widely קורית דרך axios
widelyRouter.get('/', hasRole('admin'), widelyController.searchUsers)

export default widelyRouter
