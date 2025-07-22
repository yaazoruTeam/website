import { Widely } from '@/model/src'
import { callingWidely } from './callingWidely'
import { validateRequiredParam, validateWidelyResult } from '@/utils/widelyValidation'

const sendMobileAction = async (endpoint_id: string | number, action: string): Promise<Widely.Model> => {
    // Validate required parameters
    validateRequiredParam(endpoint_id, 'endpoint_id')
    validateRequiredParam(action, 'action')

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

export { sendMobileAction }
