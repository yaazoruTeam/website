import { NextFunction, Request, Response } from 'express'
import { sendMobileAction } from '../../integration/widely/widelyActions'
import { validateRequiredParam } from '../../utils/widelyValidation'

const sendApn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')

    const result = await sendMobileAction(endpoint_id, 'send_apn')

    res.status(200).json({
      success: true,
      message: 'APN settings have been sent successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

export { sendApn }