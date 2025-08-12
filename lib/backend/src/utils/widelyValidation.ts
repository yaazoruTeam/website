import { HttpError, Widely } from '@model'

const validateRequiredParams = (params: Record<string, any>): void => {
    const missingParams: string[] = []

    // Check each parameter for null, undefined, or empty string values
    Object.entries(params).forEach(([key, value]) => {
        if (value == null || (typeof value === 'string' && value.trim() === '')) {
            missingParams.push(key)
        }
    })

    // If there are missing parameters, throw a detailed error
    if (missingParams.length > 0) {
        const message = missingParams.length === 1
            ? `Parameter '${missingParams[0]}' is required.`
            : `The following parameters are required: ${missingParams.map(param => `'${param}'`).join(', ')}.`

        const error: HttpError.Model = {
            status: 400,
            message,
        }
        throw error
    }
}

const validateWidelyResult = (result: Widely.Model, errorMessage: string, checkLength: boolean = true): void => {
    // Check for API error response
    if (result.error_code !== undefined && result.error_code !== 200) {
        const error: HttpError.Model = {
            status: result.error_code || 500,
            message: errorMessage,
        }
        throw error
    }

    // Skip data validation if checkLength is false
    if (!checkLength) {
        return
    }

    // Validate data presence - handle both array and object responses
    const hasData = Array.isArray(result.data)
        ? result.data.length > 0
        : (result.data != null && typeof result.data === 'object')

    if (!hasData) {
        const error: HttpError.Model = {
            status: 404,
            message: errorMessage,
        }
        throw error
    }
}

export { validateRequiredParams, validateWidelyResult }
