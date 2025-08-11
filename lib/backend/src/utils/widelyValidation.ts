import { HttpError, Widely } from '@model'

// Type definition for parameter validation
interface ParamValidation {
    value: any
    name: string
}

// General function for parameter validation (single parameter)
const validateRequiredParam = (param: any, paramName: string): void => {
    if (param == null || param === '') {
        const error: HttpError.Model = {
            status: 400,
            message: `${paramName} is required.`,
        }
        throw error
    }
}

// Enhanced function for validating multiple parameters at once
const validateRequiredParams = (params: ParamValidation[]): void => {
    const missingParams: string[] = []
    
    params.forEach(({ value, name }) => {
        if (value == null || value === '') {
            missingParams.push(name)
        }
    })
    
    if (missingParams.length > 0) {
        const message = missingParams.length === 1 
            ? `${missingParams[0]} is required.`
            : `The following parameters are required: ${missingParams.join(', ')}.`
            
        const error: HttpError.Model = {
            status: 400,
            message,
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

export { validateRequiredParam, validateRequiredParams, validateWidelyResult }
;