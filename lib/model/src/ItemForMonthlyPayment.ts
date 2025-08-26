import { HttpError } from '.'
import { RequestWithParams, RequestWithBody } from './ExpressTypes'


interface Model {
  item_id: string
  monthlyPayment_id: string
  description: string
  quantity: number | string
  price: number | string
  total: number | string
  paymentType: string
  created_at: Date
  update_at: Date
}

function sanitize(item: Model, hasId: boolean): Model {
  if (hasId && !item.item_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "item_id".',
    }
    throw error
  }
  if (!item.monthlyPayment_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "monthlyPayment_id".',
    }
    throw error
  }
  if (!item.description) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "description".',
    }
    throw error
  }
  if (!item.quantity) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "quantity".',
    }
    throw error
  }
  if (!item.price) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "price".',
    }
    throw error
  }
  if (!item.total) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "total".',
    }
    throw error
  }
  if (!item.paymentType) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "paymentType".',
    }
    throw error
  }
  if (!item.created_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "created_at".',
    }
    throw error
  }
  if (!item.update_at) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "update_at".',
    }
    throw error
  }
  const newItem: Model = {
    item_id: item.item_id,
    monthlyPayment_id: item.monthlyPayment_id,
    description: item.description,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
    paymentType: item.paymentType,
    created_at: item.created_at,
    update_at: item.update_at,
  }
  return newItem
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
