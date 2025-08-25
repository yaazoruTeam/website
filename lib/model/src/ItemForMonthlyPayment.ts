import { AppError, RequestTypes } from '.'

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
    throw new AppError('Invalid or missing "item_id".', 400)
  }
  if (!item.monthlyPayment_id) {
    throw new AppError('Invalid or missing "monthlyPayment_id".', 400)
  }
  if (!item.description) {
    throw new AppError('Invalid or missing "description".', 400)
  }
  if (!item.quantity) {
    throw new AppError('Invalid or missing "quantity".', 400)
  }
  if (!item.price) {
    throw new AppError('Invalid or missing "price".', 400)
  }
  if (!item.total) {
    throw new AppError('Invalid or missing "total".', 400)
  }
  if (!item.paymentType) {
    throw new AppError('Invalid or missing "paymentType".', 400)
  }
  if (!item.created_at) {
    throw new AppError('Invalid or missing "created_at".', 400)
  }
  if (!item.update_at) {
    throw new AppError('Invalid or missing "update_at".', 400)
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
