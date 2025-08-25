import { HttpError, ValidationTypes, SanitizationUtils } from '.'
import { Request } from 'express'

interface Model {
  branchUser_id: string
  branch_id: string
  user_id: string
}

function sanitize(branchUser: Model, hasId: boolean): Model {
  if (hasId && !branchUser.branchUser_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branchUser_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branchUser.branch_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branchUser.user_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_id".',
    }
    throw error
  }
  const newBranchUser: Model = {
    branchUser_id: branchUser.branchUser_id,
    branch_id: branchUser.branch_id,
    user_id: branchUser.user_id,
  }
  return newBranchUser
}

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
