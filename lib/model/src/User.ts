import { HttpError, Request } from '.'

interface Model {
  user_id?: number // Optional during creation, TypeORM assigns it
  first_name: string
  last_name: string
  id_number?: string
  phone_number?: string
  additional_phone?: string
  email: string
  city?: string
  address?: string
  password?: string
  user_name: string
  role: 'admin' | 'branch'
  status: string
  // Google OAuth fields
  google_uid?: string //לא חובה , UNIQUE
  photo_url?: string // לא חובה, 
  email_verified?: boolean // לא חובה, DEFAULT TO לבדוק מה זה אומר -- ערך ברירת מחדל false  
  // Relationships
  simCards?: string[] // array של sim_card_ids או מספרי סימים
}

function sanitize(user: Model, hasId: boolean): Model {
  const isString = (value: unknown) => typeof value === 'string'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhoneNumber = (phone: string) => /^\d{9,15}$/.test(phone)
  const isValidIdNumber = (id: string) => /^\d{9}$/.test(id)

  if (hasId && !user.user_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_id".',
    }
    throw error
  }
  if (!isString(user.first_name) || user.first_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "first_name".',
    }
    throw error
  }
  if (!isString(user.last_name) || user.last_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_name".',
    }
    throw error
  }
  if (user.id_number && !isValidIdNumber(user.id_number)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "id_number". It must be exactly 9 digits.',
    }
    throw error
  }
  if (!isString(user.phone_number) || !isValidPhoneNumber(user.phone_number)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (user.additional_phone && !isValidPhoneNumber(user.additional_phone)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "additional_phone". It must be a number between 9 and 15 digits.',
    }
    throw error
  }
  if (!isString(user.email) || !isValidEmail(user.email)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "email".',
    }
    throw error
  }
  if (!isString(user.city) || user.city.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!isString(user.address) || user.address.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address".',
    }
    throw error
  }
  if (user.password && !isString(user.password)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "password".',
    }
    throw error
  }
  if (!isString(user.user_name) || user.user_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_name".',
    }
    throw error
  }
  if (!isString(user.role) || user.role.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "role".',
    }
    throw error
  }
  const newUser: Model = {
   ...user,
    phone_number: user.phone_number?.trim(),
    additional_phone: user.additional_phone?.trim(),
    email: user.email.trim().toLowerCase(),
    status: user.status || 'active',
    email_verified: user.email_verified || false,
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
  if (userExis.user_name === user.user_name) {
    const error: HttpError.Model = {
      status: 409,
      message: 'user_name already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request.RequestWithParams) => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: Request.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeExistingUser, sanitizeIdExisting, sanitizeBodyExisting }
