import { AppError, RequestTypes } from '.'

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
  const isString = (value: unknown): value is string => typeof value === 'string'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhoneNumber = (phone: string) => /^\d{9,15}$/.test(phone)

  if (hasId && !user.user_id) {
    throw new AppError('Invalid or missing "user_id".', 400)
  }
  if (!isString(user.first_name) || user.first_name.trim() === '') {
    throw new AppError('Invalid or missing "first_name".', 400)
  }
  if (!isString(user.last_name) || user.last_name.trim() === '') {
    throw new AppError('Invalid or missing "last_name".', 400)
  }
  if (!user.id_number) {
    throw new AppError('Invalid or missing "id_number".', 400)
  }
  if (!isString(user.phone_number) || !isValidPhoneNumber(user.phone_number)) {
    throw new AppError('Invalid or missing "phone_number". It must be a number between 9 and 15 digits.', 400)
  }
  if (
    user.additional_phone &&
    (!isString(user.additional_phone) || !isValidPhoneNumber(user.additional_phone))
  ) {
    throw new AppError('Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.', 400)
  }
  if (!isString(user.email) || !isValidEmail(user.email)) {
    throw new AppError('Invalid or missing "email".', 400)
  }
  if (!isString(user.city) || user.city.trim() === '') {
    throw new AppError('Invalid or missing "city".', 400)
  }
  if (!isString(user.address1) || user.address1.trim() === '') {
    throw new AppError('Invalid or missing "address1".', 400)
  }
  if (user.address2 && !isString(user.address2)) {
    throw new AppError('Invalid or missing "address2".', 400)
  }
  if (!isString(user.zipCode) || user.zipCode.trim() === '') {
    throw new AppError('Invalid or missing "zipCode".', 400)
  }
  if (!isString(user.password) || user.password.trim() === '') {
    throw new AppError('Invalid or missing "password".', 400)
  }
  if (!isString(user.user_name) || user.user_name.trim() === '') {
    throw new AppError('Invalid or missing "user_name".', 400)
  }
  if (!isString(user.role) || user.role.trim() === '') {
    throw new AppError('Invalid or missing "role".', 400)
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
    throw new AppError('id_number already exists', 409)
  }
  if (userExis.email === user.email) {
    throw new AppError('email already exists', 409)
  }
  if (userExis.password === user.password) {
    throw new AppError('password already exists', 409)
  }
  if (userExis.user_name === user.user_name) {
    throw new AppError('user_name already exists', 409)
  }
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

export { Model, sanitize, sanitizeExistingUser, sanitizeIdExisting, sanitizeBodyExisting }
