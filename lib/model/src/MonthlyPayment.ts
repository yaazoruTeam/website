import { AppError, RequestTypes } from '.'

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
    throw new AppError('Invalid or missing "monthlyPayment_id".', 400)
  }
  if (!monthlyPayment.customer_id) {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  if (!monthlyPayment.customer_name) {
    throw new AppError('Invalid or missing "customer_name".', 400)
  }
  if (!monthlyPayment.belongsOrganization) {
    throw new AppError('Invalid or missing "belongs organization".', 400)
  }
  if (!monthlyPayment.start_date) {
    throw new AppError('Invalid or missing "start_date".', 400)
  }
  if (!monthlyPayment.end_date) {
    throw new AppError('Invalid or missing "end_date".', 400)
  }
  if (!monthlyPayment.amount) {
    throw new AppError('Invalid or missing "amount".', 400)
  }
  if (!monthlyPayment.total_amount) {
    throw new AppError('Invalid or missing "total_amount".', 400)
  }
  // if (!monthlyPayment.oneTimePayment) {
  //     const error: HttpError.Model = {
  //         status: 400,
  //         message: 'Invalid or missing "oneTimePayment".',
  //     };
  //     throw error;
  // }
  if (!monthlyPayment.frequency) {
    throw new AppError('Invalid or missing "frequency".', 400)
  }
  if (!monthlyPayment.amountOfCharges) {
    throw new AppError('Invalid or missing "amount of charges".', 400)
  }
  if (!monthlyPayment.dayOfTheMonth) {
    throw new AppError('Invalid or missing "day of the month".', 400)
  }
  if (!monthlyPayment.next_charge) {
    throw new AppError('Invalid or missing "next_charge".', 400)
  }
  if (!monthlyPayment.last_attempt) {
    throw new AppError('Invalid or missing "last_attempt".', 400)
  }
  if (!monthlyPayment.last_sucsse) {
    throw new AppError('Invalid or missing "last_sucsse".', 400)
  }
  if (!monthlyPayment.created_at) {
    throw new AppError('Invalid or missing "created_at".', 400)
  }
  if (!monthlyPayment.update_at) {
    throw new AppError('Invalid or missing "update_at".', 400)
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
