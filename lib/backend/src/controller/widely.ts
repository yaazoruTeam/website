import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../model'
import { searchUser } from '../integration/widely/searchUsere'

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
        const result: any = await searchUser(simNumber)

        res.status(result.status).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

export { searchUsers }
