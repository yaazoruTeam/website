import { Request, Response, NextFunction } from 'express'
import { charge } from '@tranzila/Authentication'
import { handleError } from './err'
import logger from '../utils/logger'
import config from '../config'

const chargeTokenTranzila = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body
    const transaction = {
      terminal_name: config.tranzila.terminalName,
      expire_month: config.tranzila.expireMonth,//to do:Check where the data comes from.
      expire_year: config.tranzila.expireYear,//to do:Check where the data comes from.
      cvv: config.tranzila.cvv,//to do:Check where the data comes from.
      card_number: config.tranzila.cardNumber, //Accepts the credit card token instead of the card number
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
  } catch (error: unknown) {
    logger.error('error in charge!!', { error })
    handleError(error, next)
  }
}

export { chargeTokenTranzila }
