import { AppError, Widely, WidelyTypes } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'

const sendMobileAction = async (endpoint_id: string | number, action: string): Promise<Widely.Model> => {
    // Validate required parameters
    validateRequiredParams({ endpoint_id, action })

    // Call Widely API
    const result: Widely.Model = await callingWidely(
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

const getMobileInfo = async (endpoint_id: string): Promise<WidelyTypes.WidelyMobileInfo> => {
    const result: Widely.Model = await callingWidely('get_mobile_info', { endpoint_id })

    if (result.error_code !== undefined && result.error_code !== 200) {
        throw new AppError('Failed to load device details.', result.error_code || 500)
    }

    if (result.data !== undefined) {
        const mobileData = Array.isArray(result.data) ? result.data[0] : result.data
        if (!mobileData || Object.keys(mobileData).length === 0) {
            throw new AppError('Error loading device details.', 500)
        }
        return mobileData as WidelyTypes.WidelyMobileInfo
    }

    if (!result || Object.keys(result).length === 0) {
        throw new AppError('Error loading device details.', 500)
    }

    return result as WidelyTypes.WidelyMobileInfo
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
): Promise<Widely.Model> => {
    validateRequiredParams({ domain_user_id, sim_iccid, service_id, name })

    const data: any = {
        domain_user_id,
        iccid: sim_iccid,
        service_id,
        name
    }

    if (dids && dids.length > 0) {
        data.dids = dids
    }

    const result: Widely.Model = await callingWidely('prov_create_mobile', data)
    validateWidelyResult(result, 'Failed to create mobile', false)
    return result
}

const ComprehensiveResetDevice = async (endpoint_id: string, name: string): Promise<{
    originalInfo: WidelyTypes.WidelyMobileInfo
    terminationResult: Widely.Model
    creationResult: Widely.Model
}> => {
    validateRequiredParams({ endpoint_id, name })

    let originalInfo: WidelyTypes.WidelyMobileInfo | null = null
    let terminationResult: Widely.Model | null = null
    let creationResult: Widely.Model | null = null

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

        // Ensure we have the service_id set
        const finalServiceId = originalInfo.service_id || serviceId
        if (!originalInfo.service_id && serviceId) {
            originalInfo.service_id = serviceId
        }

        // שלב 2: מחיקת המכשיר הקיים
        terminationResult = await terminateMobile(endpoint_id)

        // שלב 3: יצירת הקו מחדש עם הנתונים המקוריים
        creationResult = await provCreateMobile(
            originalInfo.domain_user_id,
            originalInfo.iccid,
            finalServiceId,
            name,
            originalInfo.dids || undefined
        )

        return {
            originalInfo: originalInfo, // We know it's not null at this point
            terminationResult,
            creationResult
        }

    } catch (error) {
        // אם יש שגיאה אחרי שהמכשיר כבר נמחק, ננסה ליצור אותו מחדש
        if (terminationResult && !creationResult && originalInfo) {
            try {
                const recoveryServiceId = originalInfo.service_id || originalInfo.package_id!
                creationResult = await provCreateMobile(
                    originalInfo.domain_user_id!,
                    originalInfo.iccid!,
                    recoveryServiceId,
                    name,
                    originalInfo.dids || undefined
                )

                return {
                    originalInfo,
                    terminationResult,
                    creationResult
                }
            } catch (recoveryError) {
                throw new Error(`Device reset failed and recovery failed. Original error: ${error}. Recovery error: ${recoveryError}`)
            }
        }

        throw error
    }
}

export { sendMobileAction, getMobileInfo, terminateMobile, provCreateMobile, ComprehensiveResetDevice }
