import { HttpError, ValidationTypes, SanitizationUtils } from '.'
import { Request } from 'express'

interface Model {
  paymentCreditLink_id: string
  monthlyPayment_id: string
  creditDetails_id: string
  status: 'active' | 'inactive'
}
function sanitize(paymentCreditLink: Model, hasId: boolean): Model {
  if (hasId && !paymentCreditLink.paymentCreditLink_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "paymentCreditLink_id".',
    }
    throw error
  }
  if (!paymentCreditLink.monthlyPayment_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "monthlyPayment_id".',
    }
    throw error
  }
  if (!paymentCreditLink.creditDetails_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "creditDetails_id".',
    }
    throw error
  }
  const newPaymentCreditLink: Model = {
    paymentCreditLink_id: paymentCreditLink.paymentCreditLink_id,
    monthlyPayment_id: paymentCreditLink.monthlyPayment_id,
    creditDetails_id: paymentCreditLink.creditDetails_id,
    status: paymentCreditLink.status || 'active',
  }
  return newPaymentCreditLink
}

const sanitizeExistingPaymentCreditLink = (
  PaymentCreditLinkExist: Model,
  paymentCreditLink: Model,
) => {
  if (PaymentCreditLinkExist.monthlyPayment_id === paymentCreditLink.monthlyPayment_id) {
    const error: HttpError.Model = {
      status: 409,
      message: 'monthlyPaiment_id already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export type { Model }
export { sanitize, sanitizeExistingPaymentCreditLink, sanitizeIdExisting, sanitizeBodyExisting }
