import { ErrorRequestHandler } from 'express'
import logger from '@utils/logger'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error('Error occurred:', JSON.stringify({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    }))
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    status,
    message,
  })
}

export { errorHandler }

