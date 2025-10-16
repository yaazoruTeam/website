import { HttpError, Widely } from '@model'
import { callingWidely } from '@integration/widely/callingWidely'
import { validateRequiredParams, validateWidelyResult } from '@utils/widelyValidation'
import { getMobileInfoData } from '@controller/widely/getActions'

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

    const requestData = {
        domain_user_id,
        iccid: sim_iccid,
        service_id,
        name,
        ...(dids && dids.length > 0 && { dids })
    }
    const result: Widely.Model = await callingWidely('prov_create_mobile', requestData)
    validateWidelyResult(result, 'Failed to create mobile', false)
    return result
}

const ComprehensiveResetDevice = async (endpoint_id: string, name: string): Promise<{
    originalInfo: Widely.WidelyMobileData
    terminationResult: Widely.Model
    creationResult: Widely.Model
}> => {
    validateRequiredParams({ endpoint_id, name })

    let originalInfo: Widely.WidelyMobileData | null = null
    let terminationResult: Widely.Model | null = null
    let creationResult: Widely.Model | null = null

    try {
        // שלב 1: קבלת מידע על המכשיר הקיים
        const mobileInfoResult = await getMobileInfoData(Number(endpoint_id))
        if (!mobileInfoResult) {
            throw new Error('Mobile info not found or invalid response')
        }

        originalInfo = mobileInfoResult

        // בדיקה שהמכשיר פעיל לפני ביצוע איפוס
        if (!originalInfo.endpoint_id || originalInfo.endpoint_id === 0) {
            console.error(`[ComprehensiveResetDevice] ERROR: Cannot reset inactive device - endpoint_id is ${originalInfo.endpoint_id}`)
            throw new Error(`Cannot reset device: Device is not active (endpoint_id: ${originalInfo.endpoint_id})`)
        }
        
        // השתמש בשדה service_id אם קיים, או package_id כחלופה
        const serviceId = originalInfo.service_id || originalInfo.package_id
        if (!originalInfo.domain_user_id || !originalInfo.iccid || !serviceId) {
            throw new Error(`Missing required fields in mobile info. Found: domain_user_id=${originalInfo.domain_user_id}, iccid=${originalInfo.iccid}, serviceId=${serviceId}`)
        }

        if (!originalInfo.service_id && serviceId) {
            originalInfo.service_id = serviceId
        }

        // שלב 2: מחיקת המכשיר הקיים (עם טיפול בשגיאות)
        try {
            terminationResult = await terminateMobile(endpoint_id)
        } catch (terminationError) {            
            // אם המחיקה נכשלה כי המכשיר לא קיים, זה בסדר - נמשיך ליצור אותו מחדש
            if (terminationError && typeof terminationError === 'object' && 
                'message' in terminationError && 
                typeof terminationError.message === 'string' &&
                (terminationError.message.includes('undefined method `endpoint`') || 
                 terminationError.message.includes('nil:NilClass'))) {
                terminationResult = {
                    status: 'SKIPPED',
                    error_code: 0,
                    message: 'Device not found in Widely, skipping termination',
                    data: {}
                } as Widely.Model
            } else {
                // אם זה שגיאה אחרת, נזרוק אותה
                throw terminationError
            }
        }

        // שלב 3: יצירת הקו מחדש עם הנתונים המקוריים
        const deviceName = name && name !== 'Not available' ? name : originalInfo.iccid || `Device_${Date.now()}`
        creationResult = await provCreateMobile(
            originalInfo.domain_user_id,
            originalInfo.iccid as string,
            Number(originalInfo.service_id),
            deviceName,
            originalInfo.dids || undefined
        )

        return {
            originalInfo,
            terminationResult,
            creationResult
        }

    } catch (error) {
        // אם יש שגיאה אחרי שהמכשיר כבר נמחק, ננסה ליצור אותו מחדש
        if (terminationResult && !creationResult && originalInfo) {
            try {
                creationResult = await provCreateMobile(
                    originalInfo.domain_user_id,
                    originalInfo.iccid as string,
                    Number(originalInfo.service_id),
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

export { sendMobileAction, terminateMobile, provCreateMobile, ComprehensiveResetDevice }
