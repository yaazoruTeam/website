import { Router } from 'express'
import * as paymentsController from '@controller/payments'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const paymentsRouter = Router()

paymentsRouter.post('/', AuditMiddleware.logCreate('payments'), paymentsController.createPayments)
paymentsRouter.get('/', paymentsController.getAllPayments)
paymentsRouter.get('/:id', paymentsController.getPaymentsId)
paymentsRouter.get('/monthlyPayment/:id', paymentsController.getPaymentsByMonthlyPaymentId)
paymentsRouter.put('/:id', AuditMiddleware.logUpdate('payments'), paymentsController.updatePayments)
paymentsRouter.delete('/:id', AuditMiddleware.logDelete('payments'), paymentsController.deletePayments)

export default paymentsRouter
