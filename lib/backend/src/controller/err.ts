import { NextFunction } from "express"

const handleError = (error: unknown,next: NextFunction) => {
    if (error instanceof Error) {
        next(error)
    }
    else {
        next(new Error(String(error)))
    }
}

export { handleError }