import { HttpError, ValidationTypes, SanitizationUtils } from '.'
import { Request } from 'express'

interface Model {
  branchCustomer_id: string
  branch_id: string
  customer_id: string
}

function sanitize(branchCustomer: Model, hasId: boolean): Model {
  if (hasId && !branchCustomer.branchCustomer_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branchCustomer_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branchCustomer.branch_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branchCustomer.customer_id)) {
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

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
