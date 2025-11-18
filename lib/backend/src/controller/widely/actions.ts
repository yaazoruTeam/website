import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely, CreateDidRequest, WidelyCreateDidPayload, GetAvailableNumbersRequest } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'
import { sendMobileAction, reprovisionDevice } from '@integration/widely/widelyActions'
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
    
    validateWidelyResult(result, 'Failed to terminate mobile', false)
    res.status(200).json(result)
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
    validateWidelyResult(result, 'Failed to get packages with info', false)
    res.status(200).json(result)
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
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

// הפעלה מחדש של מכשיר כטרנזקציה
const reprovisionDeviceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id, name } = req.body

    validateRequiredParams({ endpoint_id, name })

    const result = await reprovisionDevice(endpoint_id, name)

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
    res.status(200).json(result)
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

    validateWidelyResult(result, `Failed to ${action} mobile`, false)
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const provCreateDid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestBody = req.body as CreateDidRequest & { domain_user_id?: number }
    const { 
      purchase_type, 
      number, 
      number_type, 
      auth_id, 
      type, 
      country, 
      ring_to, 
      assign_to_package,
      sms_to_mail
    } = requestBody

    // ולידציה של פרמטר חובה
    validateRequiredParams({ purchase_type })

    // ולידציה של סוג הרכישה
    if (purchase_type !== 'new' && purchase_type !== 'port') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid purchase_type provided. It must be either "new" or "port".'
      }
      throw error
    }

    // ולידציה עבור ניוד מספר
    if (purchase_type === 'port') {
      validateRequiredParams({ number, auth_id })
      
      if (number_type && number_type !== 'U') {
        const error: HttpError.Model = {
          status: 400,
          message: 'Invalid number_type provided. For port operations, it should be null or "U" for prepaid numbers.'
        }
        throw error
      }
    }

    // ולידציה עבור רכישת מספר חדש
    if (purchase_type === 'new') {
      validateRequiredParams({ type, country })
      
      if (!['mobile', 'landline', 'kosher'].includes(type as string)) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Invalid type provided. It must be one of: "mobile", "landline", "kosher".'
        }
        throw error
      }
    }

    // ולידציה של כתובת מייל אם צוינה
    if (sms_to_mail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(sms_to_mail)) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Invalid email format provided for sms_to_mail.'
        }
        throw error
      }
    }

    // הכנת הנתונים לשליחה עם typing נכון
    const requestData: WidelyCreateDidPayload = {
      ...requestBody, // כל השדות מ-CreateDidRequest
      fake: false,
      domain_user_id: requestBody.domain_user_id,
      sms_to_mail: sms_to_mail || undefined
    }

    // הוספת פרמטרים לפי סוג הפעולה
    if (purchase_type === 'port') {
      requestData.number = number
      requestData.number_type = number_type || null
      requestData.auth_id = auth_id
    } else if (purchase_type === 'new') {
      requestData.number = ''
      requestData.type = type
      requestData.country = country
    }

    // הוספת פרמטרים אופציונליים (אם לא כבר קיימים)
    if (ring_to && !requestData.ring_to) {
      // ולידציה שזה מערך של אובייקטים עם endpoint_id
      if (!Array.isArray(ring_to)) {
        const error: HttpError.Model = {
          status: 400,
          message: 'ring_to must be an array of objects with endpoint_id.'
        }
        throw error
      }
      requestData.ring_to = ring_to
    }

    if (assign_to_package !== undefined && requestData.assign_to_package === undefined) {
      if (typeof assign_to_package !== 'boolean') {
        const error: HttpError.Model = {
          status: 400,
          message: 'assign_to_package must be a boolean value.'
        }
        throw error
      }
      requestData.assign_to_package = assign_to_package
    }

    const result: Widely.Model = await callingWidely(
      'prov_create_did',
      requestData
    )

    validateWidelyResult(result, 'Failed to create DID', false)
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const reregisterInHlr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result: Widely.Model = await sendMobileAction(endpoint_id, 'reregister_in_hlr')

    validateWidelyResult(result, 'Failed to reregister in HLR', false)
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const cancelAllLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const result: Widely.Model = await sendMobileAction(endpoint_id, 'cancel_all_locations')

    validateWidelyResult(result, 'Failed to cancel all locations', false)
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getAvailableNumbers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { country_code, number_type, city, prefix } = req.body as GetAvailableNumbersRequest

    // אם נתונו prefix או city, אין צורך ב-country_code ו-number_type
    if (prefix || city) {
      // ולידציה שלפחות אחד מהם קיים
      if (!prefix && !city) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Either prefix or city must be provided when not using country_code and number_type.'
        }
        throw error
      }
    } else {
      // אם לא נתונו prefix או city, country_code ו-number_type הם חובה
      validateRequiredParams({ country_code, number_type })

      // ולידציה של number_type
      const validNumberTypes = ['mobile', 'landline', 'kosher'] as const
      if (!validNumberTypes.includes(number_type!)) {
        const error: HttpError.Model = {
          status: 400,
          message: `Invalid number_type provided. It must be one of: ${validNumberTypes.join(', ')}.`
        }
        throw error
      }

      // ולידציה של country_code (אם נדרש)
      if (typeof country_code !== 'string' || country_code.length !== 2) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Invalid country_code provided. It must be a 2-letter country code (e.g., "IL").'
        }
        throw error
      }
    }

    // הכנת הנתונים לשליחה
    const requestData: Partial<GetAvailableNumbersRequest> = {}

    if (prefix) {
      requestData.prefix = prefix
    }
    if (city) {
      requestData.city = city
    }
    if (!prefix && !city) {
      requestData.country_code = country_code
      requestData.number_type = number_type
    }

    const result: Widely.Model = await callingWidely(
      'get_available_numbers',
      requestData
    )

    validateWidelyResult(result, 'Failed to get available numbers', false)
    res.status(200).json(result)
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
    res.status(200).json(result)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export {
  terminateMobile,
  provResetVmPincode,
  getPackagesWithInfo,
  changePackages,
  reprovisionDeviceController,
  sendApn,
  changeNetwork,
  addOneTimePackage,
  freezeUnFreezeMobile,
  provCreateDid,
  updateImeiLockStatus,
  reregisterInHlr,
  cancelAllLocations,
  getAvailableNumbers
}
