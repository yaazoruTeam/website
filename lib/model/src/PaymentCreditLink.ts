import { HttpError } from '.'
import { RequestWithParams, RequestWithBody, isString } from './CommonTypes'

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

const sanitizeIdExisting = (id: RequestWithParams): void => {
  if (!id.params?.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: RequestWithBody): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provaider',
    }
    throw error
  }
}

export type { Model }
export { sanitize, sanitizeExistingPaymentCreditLink, sanitizeIdExisting, sanitizeBodyExisting }
