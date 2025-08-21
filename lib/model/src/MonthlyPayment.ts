import { HttpError } from '.'
import { RequestWithParams, RequestWithBody } from './SharedTypes'

interface Model {
  monthlyPayment_id: string
  customer_id: string
  customer_name: string
  belongsOrganization: string
  start_date: Date
  end_date: Date
  amount: number
  total_amount: number
  oneTimePayment: number
  status: 'active' | 'inactive'
  frequency: string
  amountOfCharges: number
  dayOfTheMonth: string
  next_charge: Date
  last_attempt: Date
  last_sucsse: Date
  created_at: Date
  update_at: Date
}

function sanitize(monthlyPayment: Model, hasId: boolean): Model {
  if (hasId && !monthlyPayment.monthlyPayment_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "monthlyPayment_id".',
    }
    throw error
  }
  if (!monthlyPayment.customer_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  if (!monthlyPayment.customer_name) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_name".',
    }
    throw error
  }
  if (!monthlyPayment.belongsOrganization) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "belongs organization".',
    }
    throw error
  }
  if (!monthlyPayment.start_date) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "start_date".',
    }
    throw error
  }
  if (!monthlyPayment.end_date) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "end_date".',
    }
    throw error
  }
  if (!monthlyPayment.amount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "amount".',
    }
    throw error
  }
  if (!monthlyPayment.total_amount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "total_amount".',
    }
    throw error
  }
  // if (!monthlyPayment.oneTimePayment) {
  //     const error: HttpError.Model = {
  //         status: 400,
  //         message: 'Invalid or missing "oneTimePayment".',
  //     };
  //     throw error;
  // }
  if (!monthlyPayment.frequency) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "frequency".',
    }
    throw error
  }
  if (!monthlyPayment.amountOfCharges) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "amount of charges".',
    }
    throw error
  }
  if (!monthlyPayment.dayOfTheMonth) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "day of the month".',
    }
    throw error
  }
  if (!monthlyPayment.next_charge) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "next_charge".',
    }
    throw error
  }
  if (!monthlyPayment.last_attempt) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_attempt".',
    }
    throw error
  }
  if (!monthlyPayment.last_sucsse) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_sucsse".',
    }
    throw error
  }
  if (!monthlyPayment.created_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "created_at".',
    }
    throw error
  }
  if (!monthlyPayment.update_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "update_at".',
    }
    throw error
  }
  const newMonthlyPayment: Model = {
    monthlyPayment_id: monthlyPayment.monthlyPayment_id,
    customer_id: monthlyPayment.customer_id,
    customer_name: monthlyPayment.customer_name || '',
    belongsOrganization: monthlyPayment.belongsOrganization,
    start_date: monthlyPayment.start_date,
    end_date: monthlyPayment.end_date,
    amount: monthlyPayment.amount,
    total_amount: monthlyPayment.total_amount,
    oneTimePayment: monthlyPayment.oneTimePayment,
    status: monthlyPayment.status || 'active',
    frequency: monthlyPayment.frequency,
    amountOfCharges: monthlyPayment.amountOfCharges,
    dayOfTheMonth: monthlyPayment.dayOfTheMonth,
    next_charge: monthlyPayment.next_charge,
    last_attempt: monthlyPayment.last_attempt,
    last_sucsse: monthlyPayment.last_sucsse,
    created_at: monthlyPayment.created_at,
    update_at: monthlyPayment.update_at,
  }
  return newMonthlyPayment
}

const sanitizeIdExisting = (req: RequestWithParams) => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: RequestWithBody) => {
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
