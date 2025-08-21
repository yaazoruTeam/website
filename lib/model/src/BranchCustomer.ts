import { HttpError } from '.'
import { CommonTypes } from '.'

interface Model {
  branchCustomer_id: string
  branch_id: string
  customer_id: string
}

function sanitize(branchCustomer: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'

  if (hasId && !branchCustomer.branchCustomer_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branchCustomer_id".',
    }
    throw error
  }
  if (!isString(branchCustomer.branch_id) || branchCustomer.branch_id.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!isString(branchCustomer.customer_id) || branchCustomer.customer_id.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  const newBranchCustomer: Model = {
    branchCustomer_id: branchCustomer.branchCustomer_id,
    branch_id: branchCustomer.branch_id,
    customer_id: branchCustomer.customer_id,
  }
  return newBranchCustomer
}

const sanitizeIdExisting = (req: CommonTypes.RequestWithId): void => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: CommonTypes.RequestWithBody): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
