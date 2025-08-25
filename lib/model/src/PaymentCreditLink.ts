import { AppError, RequestTypes } from '.'

interface Model {
  paymentCreditLink_id: string
  monthlyPayment_id: string
  creditDetails_id: string
  status: 'active' | 'inactive'
}
function sanitize(paymentCreditLink: Model, hasId: boolean): Model {
  if (hasId && !paymentCreditLink.paymentCreditLink_id) {
    throw new AppError('Invalid or missing "paymentCreditLink_id".', 400)
  }
  if (!paymentCreditLink.monthlyPayment_id) {
    throw new AppError('Invalid or missing "monthlyPayment_id".', 400)
  }
  if (!paymentCreditLink.creditDetails_id) {
    throw new AppError('Invalid or missing "creditDetails_id".', 400)
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
    throw new AppError('monthlyPaiment_id already exists', 409)
  }
}

const sanitizeIdExisting = (req: RequestTypes.RequestWithParams) => {
  if (!req.params.id) {
    throw new AppError('No ID provided', 400)
  }
}

const sanitizeBodyExisting = (req: RequestTypes.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('No body provaider', 400)
  }
}

export type { Model }
export { sanitize, sanitizeExistingPaymentCreditLink, sanitizeIdExisting, sanitizeBodyExisting }
