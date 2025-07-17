import { NextFunction, Request, Response } from 'express'
import { Widely } from '../../model/src'
import { callingWidely } from '../../integration/widely/callingWidely'
import { validateRequiredParam } from '../../utils/widelyValidation'
import { sendMobileAction } from 'integration/widely/widelyActions'
import { config } from '../../config'

const terminateMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { endpoint_id } = req.body
        validateRequiredParam(endpoint_id, 'endpoint_id')
        
        const result: Widely.Model = await callingWidely(
            'prov_terminate_mobile',
            { endpoint_id: endpoint_id }
        )
        res.status(result.error_code).json(result)
    } catch (error: any) {
        next(error)
    }
}

const provResetVmPincode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

const getPackagesWithInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const result: Widely.Model = await callingWidely(
      'get_packages_with_info',
      {
        reseller_domain_id: config.widely.accountId,
        package_types: ['base']
      }
    )
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}
export { terminateMobile, provResetVmPincode, getPackagesWithInfo }
