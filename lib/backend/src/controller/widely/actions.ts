import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParam, validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'
import { sendMobileAction, ComprehensiveResetDevice } from '@integration/widely/widelyActions'
import { config } from '@config/index'

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

    const { package_types } = req.body
    validateRequiredParam(package_types, 'package_types')

    if (package_types !== 'base' && package_types !== 'extra') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid package_types provided. It must be "base" or "extra".'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'get_packages_with_info',
      {
        reseller_domain_id: config.widely.accountId,
        package_types: [package_types]
      }
    )
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}
const changePackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, package_id } = req.body
    
    validateRequiredParams([
      { value: endpoint_id, name: 'endpoint_id' },
      { value: package_id, name: 'package_id' }
    ])

    if (!package_id || isNaN(Number(package_id))) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid package_id provided. It must be a number.'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'prov_update_mobile_subscription',
      {
        endpoint_id: endpoint_id,
        service_id: package_id
      }
    )
    validateWidelyResult(result, 'Failed to change package')
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}

// איפוס מקיף של מכשיר כטרנזקציה
const ComprehensiveResetDeviceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, name } = req.body

    validateRequiredParams([
      { value: endpoint_id, name: 'endpoint_id' },
      { value: name, name: 'name' }
    ])

    const result = await ComprehensiveResetDevice(endpoint_id, name)

    const terminationSuccess = result.terminationResult.error_code === 200 || result.terminationResult.error_code === undefined
    const creationSuccess = result.creationResult.error_code === 200 || result.creationResult.error_code === undefined

    res.status(200).json({
      success: true,
      message: 'Device reset completed successfully',
      data: {
        originalInfo: result.originalInfo,
        terminationSuccess,
        creationSuccess,
        newEndpointId: result.creationResult.data?.[0]?.endpoint_id || null,
        terminationResult: result.terminationResult,
        creationResult: result.creationResult
      }
    })
  } catch (error: any) {
    next(error)
  }
}

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

const addOneTimePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, domain_user_id, package_id } = req.body
    
    validateRequiredParams([
      { value: endpoint_id, name: 'endpoint_id' },
      { value: domain_user_id, name: 'domain_user_id' },
      { value: package_id, name: 'package_id' }
    ])

    if (!package_id || isNaN(Number(package_id))) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid package_id provided. It must be a number.'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'add_once_off_subscription',
      {
        account_id: config.widely.accountId,
        domain_user_id: domain_user_id,
        endpoint_id: endpoint_id,
        new_package_ids: [package_id]
      }
    )

    validateWidelyResult(result, 'Failed to add one-time package')
    res.status(result.error_code).json(result)
  } catch (error: any) {
    next(error)
  }
}

export {
  terminateMobile,
  provResetVmPincode,
  getPackagesWithInfo,
  changePackages,
  ComprehensiveResetDeviceController,
  sendApn,
  addOneTimePackage
}
