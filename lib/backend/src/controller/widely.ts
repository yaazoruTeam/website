import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '../model'
import { callingWidely } from '../integration/widely/callingWidely'

const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {        
        const { simNumber } = req.body

        if (!simNumber) {
            const error: HttpError.Model = {
                status: 400,
                message: 'simNumber is required.',
            }
            throw error
        }

        // קריאה לשירות האינטגרציה עם WIDELY
        const result: Widely.Model = await callingWidely(
            'search_users',
            { account_id: 400000441, search_string: simNumber }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

export { searchUsers }
