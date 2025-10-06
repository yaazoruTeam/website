import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely, WidelyDeviceDetails } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { config } from '@config/index'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'
import { handleError } from '../err'
import logger from '@/src/utils/logger'

// Function for network identification
const getNetworkConnection = (mccMnc: string): string => {
  const networkMap: { [key: string]: string } = {
    '425_03': 'Pelephone',
    '425_02': 'Partner',
    '425_07': 'HOT',
  }
  return networkMap[mccMnc] || `Not available (${mccMnc})`
}

const searchUsersData = async (simNumber: string): Promise<Widely.WidelyUserData> => {
  logger.debug(`---------------searchUsersData simNumber: ${simNumber}---------------`)
  logger.debug(`searchUsersData config.widely.accountId: ${config.widely.accountId}`)
  
  const result: Widely.Model = await callingWidely(
    'search_users', {
    account_id: config.widely.accountId,
    search_string: simNumber,
  })

  logger.debug('searchUsersData callingWidely result received', { 
    result, 
    resultKeys: Object.keys(result || {}),
    dataType: Array.isArray(result?.data) ? 'array' : typeof result?.data,
    dataLength: Array.isArray(result?.data) ? result.data.length : 'not array'
  })

  // Check for API error response and validate data presence
  validateWidelyResult(result, 'SIM number not found.')
  logger.debug('searchUsersData validateWidelyResult passed')

  // Normalize data to array format for consistent handling
  const dataArray = Array.isArray(result.data) ? result.data : [result.data]
  logger.debug(`searchUsersData dataArray created`, { 
    dataArrayLength: dataArray.length,
    dataArray,
    originalDataType: Array.isArray(result.data) ? 'array' : 'single object'
  })

  // If no results found
  if (dataArray.length === 0) {
    logger.debug('No users found in Widely API response', { result })
    const error: HttpError.Model = {
      status: 404,
      message: 'SIM number not found.',
    }
    logger.debug('searchUsersData throwing error - no results found', { error })
    throw error
  }

  // If multiple results found, throw error (ambiguous search)
  if (dataArray.length > 1) {
    logger.debug('Multiple users found in Widely API response', { 
      result,
      dataArrayLength: dataArray.length,
      allUsersData: dataArray
    })
    const error: HttpError.Model = {
      status: 404,
      message: 'Multiple SIM numbers found - please provide more specific SIM number.',
    }
    logger.debug('searchUsersData throwing error - multiple results found', { error })
    throw error
  }

  // If exactly one result found, return it (successful search)
  const userData = dataArray[0]
  logger.debug('User data found in Widely API response', { 
    userData,
    userDataKeys: Object.keys(userData || {}),
    domain_user_name: userData?.domain_user_name,
    name: userData?.name,
    domain_user_id: userData?.domain_user_id
  })
  
  // Validate that userData exists and has required fields
  if (!userData || (!userData.domain_user_name) && !userData.name) {
    logger.debug('User data is missing required fields', { 
      userData,
      hasUserData: !!userData,
      hasDomainUserName: !!userData?.domain_user_name,
      hasName: !!userData?.name,
      userDataKeys: userData ? Object.keys(userData) : 'userData is null/undefined'
    })
    const error: HttpError.Model = {
      status: 404,
      message: 'SIM number not found.',
    }
    logger.debug('searchUsersData throwing error - missing required fields', { error })
    throw error
  }
  
  logger.debug('searchUsersData validation passed - returning user data', { 
    userData,
    returnedFields: {
      domain_user_name: userData.domain_user_name,
      name: userData.name,
      domain_user_id: userData.domain_user_id
    }
  })
  return userData as Widely.WidelyUserData
}

const getMobilesData = async (domain_user_id: number): Promise<Widely.WidelyMobileData> => {
  logger.debug(`---------------getMobilesData domain_user_id: ${domain_user_id}---------------`)
  
  const result: Widely.Model = await callingWidely(
    'get_mobiles', {
    domain_user_id: domain_user_id,
  })

  logger.debug('getMobilesData callingWidely result received', { 
    result,
    resultKeys: Object.keys(result || {}),
    dataType: Array.isArray(result?.data) ? 'array' : typeof result?.data,
    dataLength: Array.isArray(result?.data) ? result.data.length : 'not array'
  })

  validateWidelyResult(result, 'Failed to load user devices.')
  logger.debug('getMobilesData validateWidelyResult passed')

  const mobileData = result.data[0]
  logger.debug('getMobilesData extracted first mobile data', { 
    mobileData,
    mobileDataKeys: mobileData ? Object.keys(mobileData) : 'mobileData is null/undefined',
    endpoint_id: mobileData?.endpoint_id,
    hasMobileData: !!mobileData
  })
  
  if (!mobileData) {
    logger.debug('getMobilesData no mobile data found', { result })
    const error: HttpError.Model = {
      status: 404,
      message: 'No devices found for this user.',
    }
    logger.debug('getMobilesData throwing error - no devices found', { error })
    throw error
  }

  logger.debug('getMobilesData returning mobile data', { 
    mobileData,
    returnedFields: {
      endpoint_id: mobileData.endpoint_id,
      domain_user_id: mobileData.domain_user_id
    }
  })
  return mobileData as Widely.WidelyMobileData
}

const getMobileInfoData = async (endpoint_id: number): Promise<Widely.WidelyMobileData> => {
  logger.debug(`---------------getMobileInfoData endpoint_id: ${endpoint_id}---------------`)
  
  const result: Widely.Model = await callingWidely(
    'get_mobile_info', {
    endpoint_id: endpoint_id
  })

  logger.debug('getMobileInfoData callingWidely result received', { 
    result,
    resultKeys: Object.keys(result || {}),
    hasDataProperty: result?.data !== undefined,
    dataType: Array.isArray(result?.data) ? 'array' : typeof result?.data
  })

  // Use the updated validateWidelyResult function instead of manual checks
  validateWidelyResult(result, 'Failed to load device details', false)
  logger.debug('getMobileInfoData validateWidelyResult passed')

  // Handle response with data property (Widely.Model structure)
  if (result.data !== undefined) {
    logger.debug('getMobileInfoData handling response with data property')
    const mobileData = Array.isArray(result.data) ? result.data[0] : result.data
    
    logger.debug('getMobileInfoData extracted mobile data from result.data', { 
      mobileData,
      mobileDataKeys: mobileData ? Object.keys(mobileData) : 'mobileData is null/undefined',
      mobileDataLength: mobileData ? Object.keys(mobileData).length : 0,
      isArray: Array.isArray(result.data)
    })

    if (!mobileData || Object.keys(mobileData).length === 0) {
      logger.debug('getMobileInfoData mobile data is empty or missing', { mobileData })
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device details.',
      }
      logger.debug('getMobileInfoData throwing error - empty mobile data', { error })
      throw error
    }

    // Add the endpoint_id to the mobile data since it's not returned by the API
    const mobileDataWithEndpoint = {
      ...mobileData,
      endpoint_id: endpoint_id
    }
    
    return mobileDataWithEndpoint as Widely.WidelyMobileData
  }

  logger.debug('getMobileInfoData handling direct object response (without data property)')
  // Handle direct object response (without data property)
  if (!result || Object.keys(result).length === 0) {
    logger.debug('getMobileInfoData result is empty or missing', { result })
    const error: HttpError.Model = {
      status: 500,
      message: 'Error loading device details.',
    }
    logger.debug('getMobileInfoData throwing error - empty result', { error })
    throw error
  }

  logger.debug('getMobileInfoData returning result as mobile data (fallback)', { 
    result,
    resultKeys: Object.keys(result)
  })
  // In this case, result is the complete Widely.Model, but we need just the mobile data
  // This should not happen if data property exists, but as fallback
  // Add the endpoint_id to the result
  const resultWithEndpoint = {
    ...(result as unknown as Widely.WidelyMobileData),
    endpoint_id: endpoint_id
  }
  
  return resultWithEndpoint as Widely.WidelyMobileData
}

const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.debug(`searchUsers Request body: ${JSON.stringify(req.body)}`)
  try {
    const { simNumber } = req.body
    logger.debug(`searchUsers simNumber: ${simNumber}`)
    validateRequiredParams({ simNumber })
    logger.debug('searchUsers parameters validated')

    const userData = await searchUsersData(simNumber)
    res.status(200).json(userData)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getMobiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { domain_user_id } = req.body
    validateRequiredParams({ domain_user_id })

    const mobileData = await getMobilesData(domain_user_id)
    res.status(200).json(mobileData)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getMobileInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { endpoint_id } = req.body
    validateRequiredParams({ endpoint_id })

    const mobileInfoData = await getMobileInfoData(endpoint_id)
    res.status(200).json(mobileInfoData)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getAllUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.debug(`---------------getAllUserData started---------------`)
  try {
    const { simNumber } = req.body
    logger.debug(`getAllUserData simNumber: ${simNumber}`)
    validateRequiredParams({ simNumber })
    logger.debug('getAllUserData parameters validated')

    // Step 1: Search for user based on SIM number
    logger.debug('getAllUserData Step 1: Starting searchUsersData')
    const user = await searchUsersData(simNumber)
    logger.debug('getAllUserData Step 1 completed - user found', { 
      user,
      userKeys: Object.keys(user || {}),
      domain_user_id: user?.domain_user_id
    })

    const domain_user_id = user.domain_user_id
    if (!domain_user_id) {
      logger.debug('getAllUserData domain_user_id is missing', { user })
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading user data - missing domain_user_id.',
      }
      logger.debug('getAllUserData throwing error - missing domain_user_id', { error })
      throw error
    }

    // Step 2: Get user's mobile devices
    logger.debug(`getAllUserData Step 2: Starting getMobilesData with domain_user_id: ${domain_user_id}`)
    const mobile = await getMobilesData(domain_user_id)
    logger.debug('getAllUserData Step 2 completed - mobile found', { 
      mobile,
      mobileKeys: Object.keys(mobile || {}),
      endpoint_id: mobile?.endpoint_id
    })

    const endpoint_id = mobile.endpoint_id
    if (!endpoint_id) {
      logger.debug('getAllUserData endpoint_id is missing', { mobile })
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device data - missing endpoint_id.',
      }
      logger.debug('getAllUserData throwing error - missing endpoint_id', { error })
      throw error
    }

    // Step 3: Get detailed device information
    logger.debug(`getAllUserData Step 3: Starting getMobileInfoData with endpoint_id: ${endpoint_id}`)
    const mobileInfo = await getMobileInfoData(endpoint_id)
    logger.debug('getAllUserData Step 3 completed - mobileInfo found', { 
      mobileInfo,
      mobileInfoKeys: Object.keys(mobileInfo || {}),
      hasMobileInfo: !!mobileInfo
    })

    if (!mobileInfo) {
      logger.debug('getAllUserData mobileInfo is missing', { mobileInfo })
      const error: HttpError.Model = {
        status: 500,
        message: 'Error loading device details.',
      }
      logger.debug('getAllUserData throwing error - missing mobileInfo', { error })
      throw error
    }

    // Extract and format response data
    logger.debug('getAllUserData Step 4: Starting data extraction and formatting')
    const dataUsage = (mobileInfo?.subscriptions?.[0]?.data?.[0]?.usage as number) || (mobileInfo?.data_used as number) || 0
    const maxDataAllowance = (mobileInfo?.data_limit as number) || 0
    const mccMnc = mobileInfo?.registration_info?.mcc_mnc || ''
    const networkConnection = getNetworkConnection(mccMnc)
    const imei = mobileInfo?.sim_data?.locked_imei || mobileInfo?.registration_info?.imei || 'Not available'
    
    // Determine status based on active field
    const status = (mobileInfo as any)?.active ? 'Active' : 'Inactive'
    const responseData: WidelyDeviceDetails.Model = {
      simNumber,
      endpoint_id: endpoint_id,
      domain_user_id: mobileInfo?.domain_user_id || 0,
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
      package_id: mobileInfo?.package_id?.toString() || '',
      active: mobileInfo?.active ?? false,
    }

    logger.debug('getAllUserData Step 4 completed - response data formatted', { 
      responseData,
      responseDataKeys: Object.keys(responseData)
    })
    logger.debug('getAllUserData sending successful response')
    res.status(200).json(responseData)
  } catch (error: unknown) {
    logger.debug('getAllUserData caught error', { error })
    handleError(error, next)
  }
}

export { searchUsers, getMobiles, getMobileInfo, getAllUserData, getMobileInfoData }
