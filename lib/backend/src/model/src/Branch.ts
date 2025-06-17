import { HttpError } from '.'

interface Model {
  branch_id: string
  city: string
  address: string
  manager_name: string
  phone_number: string
  additional_phone?: string
  status: string
  sda: number
  ddd: OptionalEffectTiming
}

function sanitize(branch: Model, hasId: boolean): Model {
  const isString = (value: any) => typeof value === 'string'
  const isValidPhoneNumber = (phone: string) => /^\d{9,15}$/.test(phone)

  if (hasId && !branch.branch_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "branch_id".',
    }
    throw error
  }
  if (!isString(branch.city) || branch.city.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!isString(branch.address) || branch.address.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address".',
    }
    throw error
  }
  if (!isString(branch.manager_name) || branch.manager_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "manager_name".',
    }
    throw error
  }
  if (!isString(branch.phone_number) || !isValidPhoneNumber(branch.phone_number)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (
    branch.additional_phone &&
    (!isString(branch.additional_phone) || !isValidPhoneNumber(branch.additional_phone))
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

const sanitizeIdExisting = (id: any) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
