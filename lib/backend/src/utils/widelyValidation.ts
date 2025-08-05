import { HttpError, Widely } from '@model'

// General function for parameter validation
const validateRequiredParam = (param: any, paramName: string): void => {
    if (param == null || param === '') {
        const error: HttpError.Model = {
            status: 400,
            message: `${paramName} is required.`,
        }
        throw error
    }
}

// General function for validating results and creating errors

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

export { validateRequiredParam, validateWidelyResult }
;