import { Router } from 'express'
import * as monthlyPaymentController from '@controller/monthlypayment'
import { hasRole } from '@middleware/auth'

const monthlyPaymentRouter = Router()

monthlyPaymentRouter.post('/', monthlyPaymentController.createMonthlyPayment)
monthlyPaymentRouter.get('/', monthlyPaymentController.getMonthlyPayments)
monthlyPaymentRouter.get('/customer/:id', monthlyPaymentController.getMonthlyPaymentByCustomerId)
monthlyPaymentRouter.get('/status/:status', monthlyPaymentController.getMonthlyPaymentsByStatus)
monthlyPaymentRouter.get(
  '/organization/:organization',
  monthlyPaymentController.getMonthlyPaymentByOrganization,
)
monthlyPaymentRouter.get('/:id', monthlyPaymentController.getMonthlyPaymentId)
monthlyPaymentRouter.put('/:id', monthlyPaymentController.updateMonthlyPayment)
monthlyPaymentRouter.delete('/:id', monthlyPaymentController.deleteMonthlyPayment)

export default monthlyPaymentRouter
