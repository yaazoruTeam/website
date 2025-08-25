import { HttpError, Common } from '.'

interface Model {
  branchUser_id: string
  branch_id: string
  user_id: string
}

function sanitize(branchUser: Model, hasId: boolean): Model {
  // Removed local isString - using Common.isString instead

  if (hasId && !branchUser.branchUser_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branchUser_id".',
    }
    throw error
  }
  if (!Common.isString(branchUser.branch_id) || branchUser.branch_id.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!Common.isString(branchUser.user_id) || branchUser.user_id.trim() === '') {
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

const sanitizeIdExisting = (id: Common.ExpressRequestWithParams) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: Common.ExpressRequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
