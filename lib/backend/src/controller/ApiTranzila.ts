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
      terminal_name: 'yaazorutok',
      expire_month: 11,//to do:Check where the data comes from.
      expire_year: 2000,//to do:Check where the data comes from.
      cvv: '',//to do:Check where the data comes from.
      card_number: '', //Accepts the credit card token instead of the card number
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
