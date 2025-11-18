import { Router } from 'express'
import * as switchboardController from '@controller/switchboard'
import { hasRole } from '@middleware/auth'

const switchboardRouter = Router()

switchboardRouter.get('/call-log', hasRole('admin'), switchboardController.getCallLogHistory)

export default switchboardRouter