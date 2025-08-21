import { HttpError, Widely, MobileInfo } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'

const sendMobileAction = async (endpoint_id: string | number, action: string): Promise<Widely.Model<unknown>> => {
    // Validate required parameters
    validateRequiredParams({ endpoint_id, action })

    // Call Widely API
    const result: Widely.Model<unknown> = await callingWidely(
        'send_mobile_action',
        {
            endpoint_id,
            action
        }
    )

    // Validate the result
    validateWidelyResult(result, 'Failed to send mobile action', false)

    // Return the result
    return result
}

const getMobileInfo = async (endpoint_id: string): Promise<MobileInfo> => {
    const result: Widely.Model<MobileInfo> = await callingWidely('get_mobile_info', { endpoint_id })

    if (result.error_code !== undefined && result.error_code !== 200) {
        const error: HttpError.Model = {
            status: result.error_code || 500,
            message: 'Failed to load device details.',
        }
        throw error
    }

    if (result.data !== undefined) {
        const mobileData: MobileInfo = Array.isArray(result.data) ? result.data[0] : result.data
        if (!mobileData || Object.keys(mobileData).length === 0) {
            const error: HttpError.Model = {
                status: 500,
                message: 'Error loading device details.',
            }
            throw error
        }
        return mobileData
    }

    if (!result || Object.keys(result).length === 0) {
        const error: HttpError.Model = {
            status: 500,
            message: 'Error loading device details.',
        }
        throw error
    }

    // If we reach here, no valid data was found
    const error: HttpError.Model = {
        status: 500,
        message: 'No valid mobile data found.',
    }
    throw error
}

const terminateMobile = async (endpoint_id: string | number): Promise<Widely.Model> => {
    validateRequiredParams({ endpoint_id })

    const result: Widely.Model = await callingWidely('prov_terminate_mobile', { endpoint_id })
    validateWidelyResult(result, 'Failed to terminate mobile', false)
    return result
}

const provCreateMobile = async (
    domain_user_id: number,
    sim_iccid: string,
    service_id: number,
    name: string,
    dids?: Array<{
        purchase_type: string
        type: string
        country: string
        sms_to_mail?: string
    }>
): Promise<Widely.Model<{ endpoint_id?: string }>> => {
    validateRequiredParams({ domain_user_id, sim_iccid, service_id, name })

    const data: {
        domain_user_id: number;
        iccid: string;
        service_id: number;
        name: string;
        dids?: Array<{
            purchase_type: string;
            type: string;
            country: string;
            sms_to_mail?: string;
        }>;
    } = {
        domain_user_id,
        iccid: sim_iccid,
        service_id,
        name
    }

    if (dids && dids.length > 0) {
        data.dids = dids
    }

    const result: Widely.Model<{ endpoint_id?: string }> = await callingWidely('prov_create_mobile', data)
    validateWidelyResult(result, 'Failed to create mobile', false)
    return result
}

const ComprehensiveResetDevice = async (endpoint_id: string, name: string): Promise<{
    originalInfo: MobileInfo
    terminationResult: Widely.Model<unknown>
    creationResult: Widely.Model<{ endpoint_id?: string }>
}> => {
    validateRequiredParams({ endpoint_id, name })

    let originalInfo: MobileInfo | null = null
    let terminationResult: Widely.Model<unknown> | null = null
    let creationResult: Widely.Model<{ endpoint_id?: string }> | null = null

    try {
        // שלב 1: קבלת מידע על המכשיר הקיים
        const mobileInfoResult = await getMobileInfo(endpoint_id)
        if (!mobileInfoResult) {
            throw new Error('Mobile info not found or invalid response')
        }

        originalInfo = mobileInfoResult

        // השתמש בשדה service_id אם קיים, או package_id כחלופה
        const serviceId = originalInfo.service_id || originalInfo.package_id
        if (!originalInfo.domain_user_id || !originalInfo.iccid || !serviceId) {
            throw new Error(`Missing required fields in mobile info. Found: domain_user_id=${originalInfo.domain_user_id}, iccid=${originalInfo.iccid}, serviceId=${serviceId}`)
        }

        if (!originalInfo.service_id && serviceId) {
            originalInfo.service_id = serviceId
        }

        // שלב 2: מחיקת המכשיר הקיים
        terminationResult = await terminateMobile(endpoint_id)

        // שלב 3: יצירת הקו מחדש עם הנתונים המקוריים
        const dids = Array.isArray(originalInfo.dids) && originalInfo.dids.length > 0 && 
                    typeof originalInfo.dids[0] === 'object' ? 
                    originalInfo.dids as Array<{ purchase_type: string; type: string; country: string; sms_to_mail?: string }> : 
                    undefined;
        
        creationResult = await provCreateMobile(
            Number(originalInfo.domain_user_id),
            originalInfo.iccid,
            Number(originalInfo.service_id),
            name,
            dids
        )

        return {
            originalInfo,
            terminationResult: terminationResult || { status: 'error', error_code: 500, message: 'Termination failed', data: [] },
            creationResult: creationResult || { status: 'error', error_code: 500, message: 'Creation failed', data: [] }
        }

    } catch (error) {
        // אם יש שגיאה אחרי שהמכשיר כבר נמחק, ננסה ליצור אותו מחדש
        if (terminationResult && !creationResult && originalInfo) {
            try {
                const dids = Array.isArray(originalInfo.dids) && originalInfo.dids.length > 0 && 
                            typeof originalInfo.dids[0] === 'object' ? 
                            originalInfo.dids as Array<{ purchase_type: string; type: string; country: string; sms_to_mail?: string }> : 
                            undefined;
                
                creationResult = await provCreateMobile(
                    Number(originalInfo.domain_user_id),
                    originalInfo.iccid,
                    Number(originalInfo.service_id),
                    name,
                    dids
                )

                return {
                    originalInfo,
                    terminationResult: terminationResult || { status: 'error', error_code: 500, message: 'Termination failed', data: [] },
                    creationResult: creationResult || { status: 'error', error_code: 500, message: 'Creation failed', data: [] }
                }
            } catch (recoveryError) {
                throw new Error(`Device reset failed and recovery failed. Original error: ${error}. Recovery error: ${recoveryError}`)
            }
        }

        throw error
    }
}

export { sendMobileAction, getMobileInfo, terminateMobile, provCreateMobile, ComprehensiveResetDevice }
