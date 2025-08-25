import { AppError, RequestTypes } from '.'

interface Model {
  branchCustomer_id: string
  branch_id: string
  customer_id: string
}

function sanitize(branchCustomer: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'

  if (hasId && !branchCustomer.branchCustomer_id) {
    throw new AppError('Invalid or missing "branchCustomer_id".', 400)
  }
  if (!isString(branchCustomer.branch_id) || branchCustomer.branch_id.trim() === '') {
    throw new AppError('Invalid or missing "branch_id".', 400)
  }
  if (!isString(branchCustomer.customer_id) || branchCustomer.customer_id.trim() === '') {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  const newBranchCustomer: Model = {
    branchCustomer_id: branchCustomer.branchCustomer_id,
    branch_id: branchCustomer.branch_id,
    customer_id: branchCustomer.customer_id,
  }
  return newBranchCustomer
}

const sanitizeIdExisting = (req: RequestTypes.RequestWithParams) => {
  if (!req.params.id) {
    throw new AppError('No ID provided', 400)
  }
}

const sanitizeBodyExisting = (req: RequestTypes.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('No body provided', 400)
  }
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
