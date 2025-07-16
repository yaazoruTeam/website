import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely, WidelyDeviceDetails } from '../../model/src'
import { callingWidely } from '../../integration/widely/callingWidely'
import { config } from '../../config'
import { validateRequiredParam, validateWidelyResult } from '../../utils/widelyValidation'

// Function for network identification
const getNetworkConnection = (mccMnc: string): string => {
  const networkMap: { [key: string]: string } = {
    '425_03': 'Pelephone',
    '425_02': 'Partner',
    '425_07': 'HOT',
  }
  return networkMap[mccMnc] || `Not available (${mccMnc})`
}

const searchUsersData = async (simNumber: string): Promise<any> => {
  const result: Widely.Model = await callingWidely(
    'search_users', {
    account_id: config.widely.accountId,
    search_string: simNumber,
  })

  // Check for API error response and validate data presence
  validateWidelyResult(result, 'SIM number not found.')

  // Normalize data to array format for consistent handling
  const dataArray = Array.isArray(result.data) ? result.data : [result.data]

  // Ensure we have exactly one result (exact match)
  if (dataArray.length > 1) {
    const error: HttpError.Model = {
      status: 404,
      message: 'SIM number not found.',
    }
    throw error
  }

  // Validate that the result is an exact match
  const userData = dataArray[0]
  const foundName = userData?.domain_user_name || userData?.name || '';
  
  // Normalize comparison to handle case sensitivity and whitespace
  const normalizedSearched = simNumber.trim().toLowerCase()
  const normalizedFound = foundName.trim().toLowerCase()
  
  if (normalizedFound !== normalizedSearched) {
    const error: HttpError.Model = {
      status: 404,
      message: 'SIM number not found.',
    }
    throw error
  }

  return userData
}

const getMobilesData = async (domain_user_id: string): Promise<any> => {
  const result: Widely.Model = await callingWidely(
    'get_mobiles', {
    domain_user_id: domain_user_id,
  })

  validateWidelyResult(result, 'Failed to load user devices.')

  const mobileData = result.data[0]
  if (!mobileData) {
    const error: HttpError.Model = {
      status: 404,
      message: 'No devices found for this user.',
    }
    throw error
  }

  return mobileData
}

const getMobileInfoData = async (endpoint_id: string): Promise<any> => {
  const result: Widely.Model = await callingWidely(
    'get_mobile_info', {
    endpoint_id: endpoint_id
    })
  
  // Check for error_code in response
  if (result.error_code !== undefined && result.error_code !== 200) {
    const error: HttpError.Model = {
      status: result.error_code || 500,
      message: 'Failed to load device details.',
    }
    throw error
  }
  
  // Type guard to check if response has Widely.Model structure
  const hasDataProperty = (response: Widely.Model): response is Widely.Model => {
    return 'data' in response && response.data !== undefined;
  }
  
  // Handle response with data property (Widely.Model structure)
  if (hasDataProperty(result)) {
    const mobileData = Array.isArray(result.data) ? result.data[0] : result.data
    
    if (!mobileData || Object.keys(mobileData).length === 0) {
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device details.',
      }
      throw error
    }
    
    return mobileData
  }
  
  // Handle direct object response (without data property)
  if (!result || Object.keys(result).length === 0) {
    const error: HttpError.Model = {
      status: 500,
      message: 'Error loading device details.',
    }
    throw error
  }
  
  return result
}

const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { simNumber } = req.body
    validateRequiredParam(simNumber, 'simNumber')

    const userData = await searchUsersData(simNumber)
    res.status(200).json(userData)
  } catch (error: any) {
    next(error)
  }
}

const getMobiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { domain_user_id } = req.body
    validateRequiredParam(domain_user_id, 'domain_user_id')

    const mobileData = await getMobilesData(domain_user_id)
    res.status(200).json(mobileData)
  } catch (error: any) {
    next(error)
  }
}

const getMobileInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParam(endpoint_id, 'endpoint_id')

    const mobileInfoData = await getMobileInfoData(endpoint_id)
    res.status(200).json(mobileInfoData)
  } catch (error: any) {
    next(error)
  }
}

const getAllUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { simNumber } = req.body
    validateRequiredParam(simNumber, 'simNumber')

    // Step 1: Search for user based on SIM number
    let user;
    try {
      user = await searchUsersData(simNumber)
    } catch (error: any) {
      // Pass through SIM not found errors as-is
      if (error.message === 'SIM number not found.') {
        throw error;
      }
      // Convert other errors to generic search error
      const err: HttpError.Model = {
        status: 500,
        message: 'Error searching for user data.',
      }
      throw err;
    }

    const domain_user_id = user.domain_user_id
    if (!domain_user_id) {
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading user data - missing domain_user_id.',
      }
      throw error
    }

    // Step 2: Get user's mobile devices
    let mobile;
    try {
      mobile = await getMobilesData(domain_user_id)
    } catch (error: any) {
      // If no devices found, treat as SIM not found
      if (error.message === 'No devices found for this user.') {
        const err: HttpError.Model = {
          status: 404,
          message: 'SIM number not found.',
        }
        throw err;
      }
      // Convert other errors to generic device loading error
      const err: HttpError.Model = {
        status: 500,
        message: 'Error loading user devices.',
      }
      throw err;
    }

    const endpoint_id = mobile.endpoint_id
    if (!endpoint_id) {
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device data - missing endpoint_id.',
      }
      throw error
    }

    // Step 3: Get detailed device information
    const mobileInfo = await getMobileInfoData(endpoint_id)

    if (!mobileInfo) {
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device details.',
      }
      throw error
    }

    // Extract and format response data
    const dataUsage = mobileInfo?.subscriptions?.[0]?.data?.[0]?.usage || mobileInfo?.data_used || 0
    const maxDataAllowance = mobileInfo?.data_limit || 0
    const mccMnc = mobileInfo?.registration_info?.mcc_mnc || ''
    const networkConnection = getNetworkConnection(mccMnc)
    const imei = mobileInfo?.sim_data?.locked_imei || mobileInfo?.registration_info?.imei || 'Not available'
    const status = mobileInfo?.registration_info?.status || 'Unknown'

    const responseData: WidelyDeviceDetails.Model = {
      simNumber,
      endpoint_id: parseInt(endpoint_id) || 0,
      network_connection: networkConnection,
      data_usage_gb: parseFloat(dataUsage.toFixed(3)),
      max_data_gb: parseFloat(maxDataAllowance.toFixed(3)),
      imei1: imei,
      status: status,
      imei_lock: mobileInfo?.sim_data?.lock_on_first_imei ? 'Locked' : 'Not locked',
      msisdn: mobileInfo?.sim_data?.msisdn || mobileInfo?.registration_info?.msisdn || 'Not available',
      iccid: mobileInfo?.sim_data?.iccid || mobileInfo?.iccid || 'Not available',
      device_info: {
        brand: mobileInfo?.device_info?.brand || 'Not available',
        model: mobileInfo?.device_info?.model || 'Not available',
        name: mobileInfo?.device_info?.name || 'Not available',
      },
    }

    res.status(200).json(responseData)
  } catch (error: any) {
    next(error)
  }
}

//TODO: Move this function into the correct folder and file.
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
export { searchUsers, getMobiles, getMobileInfo, getAllUserData, terminateMobile }

