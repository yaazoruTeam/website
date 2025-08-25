import { AppError, RequestTypes } from '.'

interface Model {
  customer_id: string
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
  status: string
  created_at: Date
  updated_at: Date
}

function sanitize(customer: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhoneNumber = (phone: string | number) => {
    const phoneStr = String(phone) // המרה למחרוזת
    const cleaned = phoneStr.replace(/[\s-]/g, '') // מסיר מקפים ורווחים
    const normalized = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned

    return /^\d{9,10}$/.test(normalized)
  }

  console.log('customer sanitaized: ', customer)

  if (hasId && !customer.customer_id) {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  if (!isString(customer.first_name) || customer.first_name.trim() === '') {
    console.log('faild first name: ', customer.first_name)

    throw new AppError('Invalid or missing "first_name".', 400)
  }
  if (!isString(customer.last_name) || customer.last_name.trim() === '') {
    console.log('faild last name: ', customer.last_name)
    throw new AppError('Invalid or missing "last_name".', 400)
  }
  if (!customer.id_number) {
    console.log('faild id number:', customer.id_number)
    throw new AppError('Invalid or missing "id_number".', 400)
  }
  if (!customer.phone_number || !isValidPhoneNumber(customer.phone_number)) {
    console.log('faild phone number: ', customer.phone_number)

    throw new AppError('Invalid or missing "phone_number". It must be a number between 9 and 15 digits.', 400)
  }
  if (
    customer.additional_phone &&
    (!customer.additional_phone || !isValidPhoneNumber(customer.additional_phone))
  ) {
    console.log('faild additional phone: ', customer.additional_phone)

    throw new AppError('Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.', 400)
  }
  if (!isString(customer.email) || !isValidEmail(customer.email.trim())) {
    console.log('faild email: ', customer.email)

    throw new AppError('Invalid or missing "email".', 400)
  }
  if (!isString(customer.city) || customer.city.trim() === '') {
    console.log('faild city: ', customer.city)

    throw new AppError('Invalid or missing "city".', 400)
  }
  if (!isString(customer.address1) || customer.address1.trim() === '') {
    console.log('faild address1: ', customer.address1)

    throw new AppError('Invalid or missing "address1".', 400)
  }
  if (customer.address2 && !isString(customer.address2)) {
    console.log('faild address2: ', customer.address2)

    throw new AppError('Invalid or missing "address2".', 400)
  }

  const newCustomer: Model = {
    customer_id: customer.customer_id,
    first_name: customer.first_name.trim(),
    last_name: customer.last_name.trim(),
    id_number: customer.id_number,
    phone_number: customer.phone_number,
    additional_phone: customer.additional_phone,
    email: customer.email.trim().toLowerCase(),
    city: customer.city.trim(),
    address1: customer.address1.trim(),
    address2: customer.address2,
    zipCode: customer.zipCode || '',
    status: customer.status || 'active',
    created_at: customer.created_at || new Date(Date.now()),
    updated_at: customer.updated_at || new Date(Date.now()),
  }
  return newCustomer
}

const sanitizeExistingCustomer = (customerExis: Model, customer: Model) => {
  if (customerExis.id_number === customer.id_number) {
    throw new AppError('id_number already exists', 409)
  }
  if (customerExis.email === customer.email) {
    throw new AppError('email already exists', 409)
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

export { Model, sanitize, sanitizeExistingCustomer, sanitizeIdExisting, sanitizeBodyExisting }
