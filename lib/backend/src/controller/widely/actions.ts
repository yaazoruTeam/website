import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'
import { sendMobileAction, ComprehensiveResetDevice } from '@integration/widely/widelyActions'
import { config } from '@config/index'
import { handleError } from '../err'

const terminateMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result: Widely.Model = await callingWidely(
      'prov_terminate_mobile',
      { endpoint_id: endpoint_id }
    )
    res.status(result.error_code).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const changeNetwork = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { endpoint_id, network_name } = req.body;

    // ולידציות בסיסיות
    validateRequiredParams({ endpoint_id, network_name });

    // נירמול שם הרשת
    const normalized = network_name.toLowerCase();

    // מיפוי הרשתות לפעולות API
    const networkActions = {
      pelephone_and_partner: "both_networks_pl_first_force",
      hot_and_partner: "both_networks_ht_first_force",
      pelephone: "pelephone_only_force"
    } as const;

    const action = networkActions[normalized as keyof typeof networkActions];

    // בדיקה אם הרשת קיימת
    if (!action) {
      const error: HttpError.Model = {
        status: 400,
        message: `Invalid network_name provided. Use one of: "pelephone_and_partner", "hot_and_partner", "pelephone".`
      };
      throw error;
    }

    const numericEndpointId = parseInt(endpoint_id);

    // שליחת הפעולה
    const result = await sendMobileAction(numericEndpointId, action);

    res.status(200).json(result);
  } catch (error) {
    handleError(error, next)
  }
};

const getPackagesWithInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { package_types } = req.body
    validateRequiredParams({ package_types })

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
  } catch (error: unknown) {
    handleError(error, next)
  }
}
const changePackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, package_id } = req.body

    validateRequiredParams({ endpoint_id, package_id })

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
  } catch (error: unknown) {
    handleError(error, next)
  }
}

// איפוס מקיף של מכשיר כטרנזקציה
const ComprehensiveResetDeviceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, name } = req.body

    validateRequiredParams({ endpoint_id, name })

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
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const sendApn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result = await sendMobileAction(endpoint_id, 'send_apn')

    res.status(200).json({
      success: true,
      message: 'APN settings have been sent successfully',
      data: result
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const provResetVmPincode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result = await sendMobileAction(endpoint_id, 'prov_reset_vm_pincode')

    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const addOneTimePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, domain_user_id, package_id } = req.body

    validateRequiredParams({ endpoint_id, domain_user_id, package_id })

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
  } catch (error: unknown) {
    handleError(error, next)
  }
}


const freezeUnFreezeMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    const { action } = req.body
    validateRequiredParams({ endpoint_id, action })

    if (action !== 'freeze' && action !== 'unfreeze') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid action provided. It must be either "freeze" or "unfreeze".'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'freeze_unfreeze_endpoint',
      {
        endpoint_id: endpoint_id,
        action: action,
      }
    )

    res.status(result.error_code).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const reregisterInHlr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result: Widely.Model = await sendMobileAction(endpoint_id, 'reregister_in_hlr')

    res.status(result.error_code).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const updateImeiLockStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, iccid, action } = req.body
    validateRequiredParams({ endpoint_id, iccid, action })

    if (typeof action !== 'boolean') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid action provided. It must be a boolean value (true/false).'
      }
      throw error
    }

    const result: Widely.Model = await callingWidely(
      'prov_update_mobile',
      {
        endpoint_id: endpoint_id,
        iccid: iccid,
        lock_on_first_imei: action,
      }
    )

    const operation = action ? 'lock' : 'unlock';
    validateWidelyResult(result, `Failed to ${operation} IMEI lock`);
    res.status(result.error_code).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export {
  terminateMobile,
  provResetVmPincode,
  getPackagesWithInfo,
  changePackages,
  ComprehensiveResetDeviceController,
  sendApn,
  changeNetwork,
  addOneTimePackage,
  freezeUnFreezeMobile,
  updateImeiLockStatus,
  reregisterInHlr
}
