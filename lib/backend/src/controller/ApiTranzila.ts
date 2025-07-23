import { Request, Response, NextFunction } from 'express'
import { charge } from '@/tranzila/Authentication'

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
    console.log('result after charge')
    console.log(result)
    res.status(200).json(result)
  } catch (error: any) {
    console.log('error in charge!!')
    next(error)
  }
}

export { chargeTokenTranzila }
