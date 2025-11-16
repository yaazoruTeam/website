import { HttpError, Request } from '.'

export enum CustomerCategory {
  MAIN = 'main',
  SAND = 'sand',
  YOUTUBE = 'youtube',
  APP = 'app',
  WAZE = 'waze'
}

interface Model {
  customer_id: number
  first_name: string
  last_name: string
  id_number: string
  phone_number: string
  additional_phone: string
  email: string
  city: string
  address: string
  status: string
  category: CustomerCategory | null
  created_at: Date
  updated_at: Date
}

function sanitize(customer: Model, hasId: boolean): Model {
  console.log('Sanitizing Customer:', customer.email, 'hasId:', hasId);
  
  const isString = (value: unknown) => typeof value === 'string'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  
  // פונקציה לניקוי וחיזור מספר טלפון
  const cleanAndNormalizePhone = (phone: string | number): string => {
    const phoneStr = String(phone) // המרה למחרוזת
    const cleaned = phoneStr.replace(/[\s\-()]/g, '') // מסיר רווחים, מקפים וסוגריים
    
    // אם המספר לא מתחיל ב-0 ו-הוא נראה כמו מספר ישראלי (9 ספרות), מוסיף 0 בהתחלה
    if (!cleaned.startsWith('0') && cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
      return '0' + cleaned
    }
    
    return cleaned
  }
  
  const isValidPhoneNumber = (phone: string | number) => {
    const normalizedPhone = cleanAndNormalizePhone(phone)
    // תמיכה במספרי טלפון בינלאומיים - בין 7 ל-15 ספרות
    return /^\d{7,15}$/.test(normalizedPhone)
  }
  if (hasId && !customer.customer_id) {
    console.log('Customer missing customer_id');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  if (!isString(customer.first_name) || customer.first_name.trim() === '') {
    console.log('Customer missing or invalid first_name');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "first_name".',
    }
    throw error
  }
  if (!isString(customer.last_name) || customer.last_name.trim() === '') {
    console.log('Customer missing or invalid last_name');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_name".',
    }
    throw error
  }
  if (!customer.id_number) {
    console.log('Customer missing id_number');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "id_number".',
    }
    throw error
  }
  if (!customer.phone_number || !isValidPhoneNumber(customer.phone_number)) {
    console.log('Customer missing or invalid phone_number');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "phone_number". It must be a valid phone number with 7-15 digits.',
    }
    throw error
  }
  if (
    customer.additional_phone &&
    (!customer.additional_phone || !isValidPhoneNumber(customer.additional_phone))
  ) {
    const error: HttpError.Model = {
      status: 400,
      message:
        'Invalid "additional_phone". It must be a valid phone number with 7-15 digits.',
    }
    throw error
  }
  if (!isString(customer.email) || !isValidEmail(customer.email.trim())) {
    console.log('Customer missing or invalid email');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "email".',
    }
    throw error
  }
  if (!isString(customer.city) || customer.city.trim() === '') {
    console.log('Customer missing or invalid city');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "city".',
    }
    throw error
  }
  if (!isString(customer.address) || customer.address.trim() === '') {
    console.log('Customer missing or invalid address');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "address".',
    }
    throw error
  }

  const newCustomer: Model = {
    customer_id: customer.customer_id,
    first_name: customer.first_name.trim(),
    last_name: customer.last_name.trim(),
    id_number: customer.id_number,
    phone_number: cleanAndNormalizePhone(customer.phone_number),
    additional_phone: customer.additional_phone ? cleanAndNormalizePhone(customer.additional_phone) : customer.additional_phone,
    email: customer.email.trim().toLowerCase(),
    city: customer.city.trim(),
    address: customer.address.trim(),
    status: customer.status || 'active',
    category: customer.category || null,
    created_at: customer.created_at || new Date(Date.now()),
    updated_at: customer.updated_at || new Date(Date.now()),
  }
  return newCustomer
}

const sanitizeExistingCustomer = (customerExis: Model, customer: Model) => {
  if (customerExis.id_number === customer.id_number) {
    const error: HttpError.Model = {
      status: 409,
      message: 'id_number already exists',
    };
    throw error;
  }
  if (customerExis.email === customer.email) {
    const error: HttpError.Model = {
      status: 409,
      message: 'email already exists',
    };
    throw error;
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

export { Model, sanitize, sanitizeExistingCustomer, sanitizeIdExisting, sanitizeBodyExisting }
