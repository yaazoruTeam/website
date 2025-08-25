import { AppError, RequestTypes } from '.'

interface Model {
  credit_id: string
  customer_id: string
  token: string
  expiry_month: number
  expiry_year: number
  created_at: Date
  update_at: Date
}

function sanitize(creditDetails: Model, hasId: boolean): Model {
  if (hasId && !creditDetails.credit_id) {
    throw new AppError('Invalid or missing "credit_id".', 400)
  }
  if (!creditDetails.customer_id) {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  if (!creditDetails.token) {
    throw new AppError('Invalid or missing "token".', 400)
  }
  if (!creditDetails.expiry_month) {
    throw new AppError('Invalid or missing "expiry_month".', 400)
  }
  if (!creditDetails.expiry_year) {
    throw new AppError('Invalid or missing "expiry_year".', 400)
  }
  if (!creditDetails.created_at) {
    throw new AppError('Invalid or missing "created_at".', 400)
  }
  if (!creditDetails.update_at) {
    throw new AppError('Invalid or missing "update_at".', 400)
  }
  const newCreditDetails: Model = {
    credit_id: creditDetails.credit_id,
    customer_id: creditDetails.customer_id,
    token: creditDetails.token,
    expiry_month: creditDetails.expiry_month,
    expiry_year: creditDetails.expiry_year,
    created_at: creditDetails.created_at,
    update_at: creditDetails.update_at,
  }
  return newCreditDetails
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
