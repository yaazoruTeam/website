import { Router } from 'express'
import * as monthlyPaymentController from '@controller/monthlypayment'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const monthlyPaymentRouter = Router()

monthlyPaymentRouter.post('/', AuditMiddleware.logCreate('monthly_payments'), monthlyPaymentController.createMonthlyPayment)
monthlyPaymentRouter.get('/', monthlyPaymentController.getMonthlyPayments)
monthlyPaymentRouter.get('/customer/:id', monthlyPaymentController.getMonthlyPaymentByCustomerId)
monthlyPaymentRouter.get('/status/:status', monthlyPaymentController.getMonthlyPaymentsByStatus)
monthlyPaymentRouter.get(
  '/organization/:organization',
  monthlyPaymentController.getMonthlyPaymentByOrganization,
)
monthlyPaymentRouter.get('/:id', monthlyPaymentController.getMonthlyPaymentId)
monthlyPaymentRouter.put('/:id', AuditMiddleware.logUpdate('monthly_payments'), monthlyPaymentController.updateMonthlyPayment)
monthlyPaymentRouter.delete('/:id', AuditMiddleware.logDelete('monthly_payments'), monthlyPaymentController.deleteMonthlyPayment)

export default monthlyPaymentRouter
