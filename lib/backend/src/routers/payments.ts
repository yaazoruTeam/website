import { Router } from 'express'
import * as paymentsController from '../controller/payments'
import { hasRole } from '../middleware/auth'

const paymentsRouter = Router()

paymentsRouter.post('/', paymentsController.createPayments)
paymentsRouter.get('/', paymentsController.getAllPayments)
paymentsRouter.get('/:id', paymentsController.getPaymentsId)
paymentsRouter.get('/monthlyPayment/:id', paymentsController.getPaymentsByMonthlyPaymentId)
paymentsRouter.put('/:id', paymentsController.updatePayments)
paymentsRouter.delete('/:id', paymentsController.deletePayments)

export default paymentsRouter
