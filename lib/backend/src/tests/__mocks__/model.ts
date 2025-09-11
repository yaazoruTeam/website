// Mock for model
export const User = {
  sanitizeBodyExisting: jest.fn(),
  sanitize: jest.fn(),
  sanitizeIdExisting: jest.fn(),
  sanitizeExistingUser: jest.fn(),
}

export const Customer = {
  sanitizeBodyExisting: jest.fn(),
  sanitize: jest.fn(),
  sanitizeIdExisting: jest.fn(),
  sanitizeExistingCustomer: jest.fn(),
}

export const Device = {
  sanitizeBodyExisting: jest.fn(),
  sanitize: jest.fn(),
  sanitizeIdExisting: jest.fn(),
  sanitizeExistingDevice: jest.fn(),
}

export const Comment = {
  sanitizeBodyExisting: jest.fn(),
  sanitize: jest.fn(),
  sanitizeIdExisting: jest.fn(),
  sanitizeExistingComment: jest.fn(),
}

export const HttpError = {
  create: jest.fn(),
}
