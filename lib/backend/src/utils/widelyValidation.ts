import { HttpError, HttpErrorWithStatus, Widely } from '@model'
import logger from './logger'

const validateRequiredParams = (params: Record<string, unknown>): void => {
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

        const error = new Error(message) as HttpErrorWithStatus.Model;
        error.status = 400;
        throw error
    }
}

const validateWidelyResult = (result: Widely.Model, errorMessage: string, checkLength: boolean = true): void => {
    logger.debug('Validating Widely API result', { result })
    // Check for API error response - both error_code and status
    const hasError = (result.error_code !== undefined && result.error_code !== 200) ||
        (result.status && result.status === "ERROR")
    logger.debug(`Widely API result hasError: ${hasError}`)
    if (hasError) {
        // Log the Widely error in a structured format for debugging
        logger.error('Widely API Error:', {
            errorCode: result.error_code || 'Unknown',
            widelyMessage: result.message || 'No message provided',
            status: result.status || 'Not provided',
            customErrorMessage: errorMessage,
            fullWidelyResponse: result
        })

        // Use Widely's message if available, otherwise use our custom message
        const widelyMessage = result.message || errorMessage
        const finalMessage = result.error_code
            ? `${errorMessage} - Widely Error Code: ${result.error_code}, Message: ${widelyMessage}`
            : `${errorMessage} - Message: ${widelyMessage}`

        logger.debug(`Final error message to throw: ${finalMessage}`)
        const error = new Error(finalMessage) as HttpErrorWithStatus.Model;
        error.status = 500; // Always return 500 for Widely API errors
        throw error
    }

    // Skip data validation if checkLength is false
    if (!checkLength) {
        logger.debug('Skipping data presence validation as checkLength is false')
        return
    }

    // Validate data presence - handle both array and object responses
    const hasData = Array.isArray(result.data)
        ? result.data.length > 0
        : (result.data != null && typeof result.data === 'object')
    logger.debug(`Widely API result hasData: ${hasData}`)
    if (!hasData) {
        logger.error('Widely API returned no data', { result })
        const error = new Error(errorMessage) as HttpErrorWithStatus.Model;
        error.status = 404;
        throw error
    }
}

export { validateRequiredParams, validateWidelyResult }
