import { NextFunction } from "express"

const handleError = (error: unknown, next: NextFunction) => {
    if (error instanceof Error) {
        next(error)
    }
    else if (typeof error === 'object' && error !== null) {
        // Pass plain objects (like HttpError) as-is
        next(error)
    }
    else {
        next(new Error(String(error)))
    }
}

export { handleError }