import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely, WidelyDeviceDetails } from '../model'
import { callingWidely } from '../integration/widely/callingWidely'
import { config } from '../config'

// General function for parameter validation
const validateRequiredParam = (param: any, paramName: string): void => {
    if (!param) {
        const error: HttpError.Model = {
            status: 400,
            message: `${paramName} is required.`,
        }
        throw error
    }
}

// General function for validating results and creating errors
const validateWidelyResult = (result: Widely.Model, errorMessage: string, checkLength: boolean = true): void => {
    if (result.error_code !== 200) {
        const error: HttpError.Model = {
            status: result.error_code || 500,
            message: errorMessage,
        }
        throw error
    }
    
    const hasData = checkLength ? 
        (result.data && result.data.length > 0) : 
        (result.data !== null && result.data !== undefined)
    
    if (!hasData) {
        const error: HttpError.Model = {
            status: 404,
            message: errorMessage,
        }
        throw error
    }
}

// Function for network identification
const getNetworkConnection = (mccMnc: string): string => {
    const networkMap: { [key: string]: string } = {
        '425_03': 'Pelephone',
        '425_02': 'Partner',
        '425_07': 'HOT'
    }
    return networkMap[mccMnc] || `Not available (${mccMnc})`
}

// Helper functions that return data
const searchUsersData = async (simNumber: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'search_users',
        { account_id: config.widely.accountId, search_string: simNumber }
    )
    
    validateWidelyResult(result, 'User not found for the provided simNumber.')
    
    const userData = result.data[0]
    if (!userData) {
        const error: HttpError.Model = {
            status: 404,
            message: 'User not found for the provided simNumber.',
        }
        throw error
    }
    
    return userData
}

const getMobilesData = async (domain_user_id: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'get_mobiles',
        { domain_user_id: domain_user_id }
    )
    
    validateWidelyResult(result, 'No mobiles found for the user.')
    
    const mobileData = result.data[0]
    if (!mobileData) {
        const error: HttpError.Model = {
            status: 404,
            message: 'No mobiles found for the user.',
        }
        throw error
    }
    
    return mobileData
}

const getMobileInfoData = async (endpoint_id: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'get_mobile_info',
        { endpoint_id: endpoint_id }
    )
    
    validateWidelyResult(result, 'Mobile info not found.', false)
    
    // Check if the data is an array or object
    const mobileData = Array.isArray(result.data) ? result.data[0] : result.data;
    return mobileData
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
        const user = await searchUsersData(simNumber)
        const domain_user_id = user.domain_user_id
        
        if (!domain_user_id) {
            const error: HttpError.Model = {
                status: 404,
                message: 'User domain_user_id not found.',
            }
            throw error
        }

        // Step 2: Get user's devices
        const mobile = await getMobilesData(domain_user_id)
        const endpoint_id = mobile.endpoint_id
        
        if (!endpoint_id) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Mobile endpoint_id not found.',
            }
            throw error
        }

        // Step 3: Get detailed device information
        const mobileInfo = await getMobileInfoData(endpoint_id)

        // Extract data usage from the correct location with safety checks
        const dataUsage = mobileInfo?.subscriptions?.[0]?.data?.[0]?.usage || mobileInfo?.data_used || 0
        
        // Network identification based on mcc_mnc
        const mccMnc = mobileInfo?.registration_info?.mcc_mnc || ''
        const networkConnection = getNetworkConnection(mccMnc)

        // Prepare data for response
        const responseData: WidelyDeviceDetails.Model = {
            simNumber,
            endpoint_id,
            network_connection: networkConnection,
            data_usage_gb: parseFloat(dataUsage.toFixed(3)),
            imei1: mobileInfo?.sim_data?.locked_imei || mobileInfo?.registration_info?.imei || 'Not available',
            status: mobileInfo?.registration_info?.status || 'Not available',
            imei_lock: mobileInfo?.sim_data?.lock_on_first_imei ? 'Locked' : 'Not locked',
            msisdn: mobileInfo?.sim_data?.msisdn || mobileInfo?.registration_info?.msisdn || 'Not available',
            iccid: mobileInfo?.sim_data?.iccid || mobileInfo?.iccid || 'Not available',
            device_info: {
                brand: mobileInfo?.device_info?.brand || 'Not available',
                model: mobileInfo?.device_info?.model || 'Not available',
                name: mobileInfo?.device_info?.name || 'Not available'
            }
        }

        res.status(200).json(responseData)
    } catch (error: any) {
        next(error)
    }
}

export { searchUsers, getMobiles, getMobileInfo, getAllUserData }


                                        
