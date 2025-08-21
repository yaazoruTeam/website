import { HttpError } from '.'
import { Request } from 'express'

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
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "payments_id".',
    }
    throw error
  }
  if (!payments.monthlyPayment_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "monthlyPayment_id".',
    }
    throw error
  }
  if (!payments.amount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "amount".',
    }
    throw error
  }
  if (!payments.date) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "date".',
    }
    throw error
  }
  if (!payments.status) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "status".',
    }
    throw error
  }
  if (!payments.created_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "created_at".',
    }
    throw error
  }
  if (!payments.update_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "update_at".',
    }
    throw error
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

const sanitizeIdExisting = (req: Request): void => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: Request): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provaider',
    }
    throw error
  }
}

export type { Model }
export { sanitize, sanitizeIdExisting, sanitizeBodyExisting }
