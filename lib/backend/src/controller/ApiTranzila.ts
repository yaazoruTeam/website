import { Request, Response, NextFunction } from 'express'
import { charge } from '@tranzila/Authentication'

const chargeTokenTranzila = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log('charge11')
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
    console.log('result after charge')
    console.log(result)
    res.status(200).json(result)
  } catch (error: any) {
    console.log('error in charge!!')
    next(error)
  }
}

export { chargeTokenTranzila }
