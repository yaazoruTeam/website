import { HttpError, ValidationTypes, RequestTypes, SanitizationUtils } from '.'
import { Request } from 'express'

interface Model {
  branch_id: string
  city: string
  address: string
  manager_name: string
  phone_number: string
  additional_phone?: string
  status: string
}

function sanitize(branch: Model, hasId: boolean): Model {
  const isValidPhoneNumber = ValidationTypes.isValidPhoneNumber

  if (hasId && !branch.branch_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branch.city)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branch.address)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(branch.manager_name)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "manager_name".',
    }
    throw error
  }
  if (!ValidationTypes.isString(branch.phone_number) || !isValidPhoneNumber(branch.phone_number)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (
    branch.additional_phone &&
    (!ValidationTypes.isString(branch.additional_phone) || !isValidPhoneNumber(branch.additional_phone))
  ) {
    const error: HttpError.Model = {
      status: 400,
      message:
        'Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.',
    }
    throw error
  }

  const newBranch: Model = {
    branch_id: branch.branch_id,
    city: branch.city,
    address: branch.address,
    manager_name: branch.manager_name,
    phone_number: branch.phone_number,
    additional_phone: branch.additional_phone,
    status: branch.status || 'active',
  }
  return newBranch
}

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
