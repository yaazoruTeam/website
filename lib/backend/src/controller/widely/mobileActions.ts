import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '../../model/src'
import { sendMobileAction } from '../../integration/widely/widelyActions'
import { validateRequiredParam } from '../../utils/widelyValidation'

const prov_reset_vm_pincode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')
    
    const result = await sendMobileAction(endpoint_id, 'prov_reset_vm_pincode')
    
    res.status(200).json({
      success: true,
      message: 'Voicemail pincode has been reset to 1234 successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

export { prov_reset_vm_pincode }