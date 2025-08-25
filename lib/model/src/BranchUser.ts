import { AppError, RequestTypes } from '.'

interface Model {
  branchUser_id: string
  branch_id: string
  user_id: string
}

function sanitize(branchUser: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'

  if (hasId && !branchUser.branchUser_id) {
    throw new AppError('Invalid or missing "branchUser_id".', 400)
  }
  if (!isString(branchUser.branch_id) || branchUser.branch_id.trim() === '') {
    throw new AppError('Invalid or missing "branch_id".', 400)
  }
  if (!isString(branchUser.user_id) || branchUser.user_id.trim() === '') {
    throw new AppError('Invalid or missing "user_id".', 400)
  }
  const newBranchUser: Model = {
    branchUser_id: branchUser.branchUser_id,
    branch_id: branchUser.branch_id,
    user_id: branchUser.user_id,
  }
  return newBranchUser
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
