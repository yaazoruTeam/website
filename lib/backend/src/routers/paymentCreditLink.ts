import { Router } from 'express'
import * as paymentCreditLinkController from '@controller/paymentCreditLink'
import { hasRole } from '@middleware/auth'

const paymentCreditLinkRouter = Router()

paymentCreditLinkRouter.post('/', paymentCreditLinkController.createPaymentCreditLink)
paymentCreditLinkRouter.get('/', paymentCreditLinkController.getPaymentCreditLinks)
paymentCreditLinkRouter.get('/:id', paymentCreditLinkController.getPaymentCreditLinkId)
paymentCreditLinkRouter.get(
  '/monthlyPayment/:id',
  paymentCreditLinkController.getPaymentCreditLinksByMonthlyPaymentId,
)
paymentCreditLinkRouter.get(
  '/creditDetails/:id',
  paymentCreditLinkController.getPaymentCreditLinksByCreditDetailsId,
)
paymentCreditLinkRouter.put('/:id', paymentCreditLinkController.updatePaymentCreditLink)
paymentCreditLinkRouter.delete('/:id', paymentCreditLinkController.deletePaymentCreditLink)

export default paymentCreditLinkRouter
