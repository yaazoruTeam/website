/**
 * Validation and sanitization types for type-safe data validation
 */

/**
 * Type guard for checking if a value is a string
 * @param value - The value to check
 * @returns True if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard for checking if a value is a number
 * @param value - The value to check
 * @returns True if the value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Type guard for checking if a value is a boolean
 * @param value - The value to check
 * @returns True if the value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard for checking if a value is a valid phone number
 * @param phone - The phone string to validate
 * @returns True if the phone number is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^\d{9,15}$/.test(phone)
}

/**
 * Type guard for checking if a value is a non-empty string
 * @param value - The value to check
 * @returns True if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim() !== ''
}

/**
 * Type guard for checking if a value is a valid email
 * @param email - The email string to validate
 * @returns True if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}