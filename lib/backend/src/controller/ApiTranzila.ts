import { Request, Response, NextFunction } from 'express'
import { charge } from '@tranzila/Authentication'
import { handleError } from './err'
import logger from '../utils/logger'

const chargeTokenTranzila = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body
    const transaction = {
      terminal_name: 'yaazorutok',
      expire_month: 11,
      expire_year: 2030,
      cvv: '123',
      card_number: 'ieff4b4e3bae1df4580',
      items: [
        {
          name: 'Pen',
          type: 'I',
          unit_price: 1.0,
          units_number: 1,
        },
      ],
    }
    const result = await charge(transaction)
    logger.info('result after charge', { result })
    res.status(200).json(result)
  } catch (error: unknown) {
    logger.error('error in charge!!', { error })
    handleError(error, next)
  }
}

export { chargeTokenTranzila }
