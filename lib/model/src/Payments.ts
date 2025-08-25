import { AppError, RequestTypes } from '.'

interface Model {
  payments_id: string
  monthlyPayment_id: string
  amount: number
  date: Date
  status: 'failed' | 'sucess' //...
  created_at: Date
  update_at: Date
}

function sanitize(payments: Model, hasId: boolean): Model {
  if (hasId && !payments.payments_id) {
    throw new AppError('Invalid or missing "payments_id".', 400)
  }
  if (!payments.monthlyPayment_id) {
    throw new AppError('Invalid or missing "monthlyPayment_id".', 400)
  }
  if (!payments.amount) {
    throw new AppError('Invalid or missing "amount".', 400)
  }
  if (!payments.date) {
    throw new AppError('Invalid or missing "date".', 400)
  }
  if (!payments.status) {
    throw new AppError('Invalid or missing "status".', 400)
  }
  if (!payments.created_at) {
    throw new AppError('Invalid or missing "created_at".', 400)
  }
  if (!payments.update_at) {
    throw new AppError('Invalid or missing "update_at".', 400)
  }
  const newPayments: Model = {
    payments_id: payments.payments_id,
    monthlyPayment_id: payments.monthlyPayment_id,
    amount: payments.amount,
    date: payments.date,
    status: payments.status,
    created_at: payments.created_at,
    update_at: payments.update_at,
  }
  return newPayments
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
export { sanitize, sanitizeIdExisting, sanitizeBodyExisting }
