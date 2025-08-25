import { HttpError, ValidationTypes, SanitizationUtils } from '.'
import { Request } from 'express'

interface Model {
  user_id: string
  first_name: string
  last_name: string
  id_number: string
  phone_number: string
  additional_phone: string
  email: string
  city: string
  address1: string
  address2: string
  zipCode: string
  password: string
  user_name: string
  role: 'admin' | 'branch'
  status: string
}

function sanitize(user: Model, hasId: boolean): Model {
  // Using ValidationTypes.isString instead
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhoneNumber = (phone: string) => /^\d{9,15}$/.test(phone)

  if (hasId && !user.user_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.first_name)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "first_name".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.last_name)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_name".',
    }
    throw error
  }
  if (!user.id_number) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "id_number".',
    }
    throw error
  }
  if (!ValidationTypes.isString(user.phone_number) || !isValidPhoneNumber(user.phone_number)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (
    user.additional_phone &&
    (!ValidationTypes.isString(user.additional_phone) || !isValidPhoneNumber(user.additional_phone))
  ) {
    const error: HttpError.Model = {
      status: 400,
      message:
        'Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (!ValidationTypes.isString(user.email) || !isValidEmail(user.email)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "email".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.city)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.address1)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address1".',
    }
    throw error
  }
  if (user.address2 && !ValidationTypes.isString(user.address2)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address2".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.zipCode)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "zipCode".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.password)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "password".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.user_name)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_name".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(user.role)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "role".',
    }
    throw error
  }
  const newUser: Model = {
    user_id: user.user_id,
    first_name: user.first_name.trim(),
    last_name: user.last_name.trim(),
    id_number: user.id_number,
    phone_number: user.phone_number.trim(),
    additional_phone: user.additional_phone,
    email: user.email.trim().toLowerCase(),
    city: user.city.trim(),
    address1: user.address1.trim(),
    address2: user.address2,
    zipCode: user.zipCode,
    password: user.password,
    user_name: user.user_name,
    role: user.role,
    status: user.status || 'active',
  }
  return newUser
}

const sanitizeExistingUser = (userExis: Model, user: Model) => {
  if (userExis.id_number === user.id_number) {
    const error: HttpError.Model = {
      status: 409,
      message: 'id_number already exists',
    }
    throw error
  }
  if (userExis.email === user.email) {
    const error: HttpError.Model = {
      status: 409,
      message: 'email already exists',
    }
    throw error
  }
  if (userExis.password === user.password) {
    const error: HttpError.Model = {
      status: 409,
      message: 'password already exists',
    }
    throw error
  }
  if (userExis.user_name === user.user_name) {
    const error: HttpError.Model = {
      status: 409,
      message: 'user_name already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export { Model, sanitize, sanitizeExistingUser, sanitizeIdExisting, sanitizeBodyExisting }
