import { HttpError } from '.'

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
  const isString = (value: any) => typeof value === 'string'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhoneNumber = (phone: string | number) => {
    const phoneStr = String(phone) // המרה למחרוזת
    const cleaned = phoneStr.replace(/[\s-]/g, '') // מסיר מקפים ורווחים
    const normalized = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned

    return /^\d{9,10}$/.test(normalized)
  }

  console.log('customer sanitaized: ', customer)

  if (hasId && !customer.customer_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  if (!isString(customer.first_name) || customer.first_name.trim() === '') {
    console.log('faild first name: ', customer.first_name)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "first_name".',
    }
    throw error
  }
  if (!isString(customer.last_name) || customer.last_name.trim() === '') {
    console.log('faild last name: ', customer.last_name)
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_name".',
    }
    throw error
  }
  if (!customer.id_number) {
    console.log('faild id number:', customer.id_number)
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "id_number".',
    }
    throw error
  }
  if (!customer.phone_number || !isValidPhoneNumber(customer.phone_number)) {
    console.log('faild phone number: ', customer.phone_number)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (
    customer.additional_phone &&
    (!customer.additional_phone || !isValidPhoneNumber(customer.additional_phone))
  ) {
    console.log('faild additional phone: ', customer.additional_phone)

    const error: HttpError.Model = {
      status: 400,
      message:
        'Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (!isString(customer.email) || !isValidEmail(customer.email.trim())) {
    console.log('faild email: ', customer.email)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "email".',
    }
    throw error
  }
  if (!isString(customer.city) || customer.city.trim() === '') {
    console.log('faild city: ', customer.city)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!isString(customer.address1) || customer.address1.trim() === '') {
    console.log('faild address1: ', customer.address1)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address1".',
    }
    throw error
  }
  if (customer.address2 && !isString(customer.address2)) {
    console.log('faild address2: ', customer.address2)

    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address2".',
    }
    throw error
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
    zipCode: customer.zipCode,
    status: customer.status || 'active',
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  }
  return newCustomer
}

const sanitizeExistingCustomer = (customerExis: Model, customer: Model) => {
  if (customerExis.id_number === customer.id_number) {
    const error: HttpError.Model = {
      status: 409,
      message: 'id_number already exists',
    }
    throw error
  }
  if (customerExis.email === customer.email) {
    const error: HttpError.Model = {
      status: 409,
      message: 'email already exists',
    }
    throw error
  }
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

export type { Model }
export { sanitize, sanitizeExistingCustomer, sanitizeIdExisting, sanitizeBodyExisting }
