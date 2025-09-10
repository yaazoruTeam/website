import { Request, Response, NextFunction } from 'express'
import { charge } from '@tranzila/Authentication'
import logger from '../utils/logger'

const chargeTokenTranzila = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body
    const transaction = {
      terminal_name: process.env.TRANZILA_TERMINAL_NAME || '',
      expire_month: parseInt(process.env.TRANZILA_EXPIRE_MONTH || ''),//to do:Check where the data comes from.
      expire_year: parseInt(process.env.TRANZILA_EXPIRE_YEAR || ''),//to do:Check where the data comes from.
      cvv: process.env.TRANZILA_CVV || '',//to do:Check where the data comes from.
      card_number: process.env.TRANZILA_CARD_NUMBER || '', //Accepts the credit card token instead of the card number
      //to do:Check where the data comes from.
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
  } catch (error: any) {
    logger.error('error in charge!!', { error })
    next(error)
  }
}

export { chargeTokenTranzila }
