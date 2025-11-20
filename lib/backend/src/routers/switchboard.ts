import { Router } from 'express'
import * as switchboardController from '@controller/switchboard'
import { hasRole } from '@middleware/auth'

const switchboardRouter = Router()

switchboardRouter.get('/call-log', hasRole('admin'), switchboardController.getCallLogHistory)
switchboardRouter.post('/customer', hasRole('admin'), switchboardController.createCustomer)

export default switchboardRouter