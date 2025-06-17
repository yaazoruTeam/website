import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err.message)
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: {
      status,
      message,
    },
  })
}

export { errorHandler }
