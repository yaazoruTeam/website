import { ErrorRequestHandler } from 'express'
import { AppError } from '@model'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err.message)
  
  let status = 500
  let message = 'Internal server error'
  
  if (err instanceof AppError) {
    status = err.status
    message = err.message
  } else if (err.status) {
    // Handle existing HttpError.Model format for backward compatibility during transition
    status = err.status
    message = err.message || 'Internal server error'
  }

  res.status(status).json({
    status,
    message,
  })
}

export { errorHandler }
