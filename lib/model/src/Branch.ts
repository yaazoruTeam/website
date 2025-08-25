import { AppError, RequestTypes } from '.'

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
  const isString = (value: unknown): value is string => typeof value === 'string'
  const isValidPhoneNumber = (phone: string) => /^\d{9,15}$/.test(phone)

  if (hasId && !branch.branch_id) {
    throw new AppError('Invalid or missing "branch_id".', 400)
  }
  if (!isString(branch.city) || branch.city.trim() === '') {
    throw new AppError('Invalid or missing "city".', 400)
  }
  if (!isString(branch.address) || branch.address.trim() === '') {
    throw new AppError('Invalid or missing "address".', 400)
  }
  if (!isString(branch.manager_name) || branch.manager_name.trim() === '') {
    throw new AppError('Invalid or missing "manager_name".', 400)
  }
  if (!isString(branch.phone_number) || !isValidPhoneNumber(branch.phone_number)) {
    throw new AppError('Invalid or missing "phone_number". It must be a number between 9 and 15 digits.', 400)
  }
  if (
    branch.additional_phone &&
    (!isString(branch.additional_phone) || !isValidPhoneNumber(branch.additional_phone))
  ) {
    throw new AppError('Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.', 400)
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
