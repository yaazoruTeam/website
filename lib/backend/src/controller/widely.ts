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

const getMobiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { domain_user_id } = req.body

        if (!domain_user_id) {
            const error: HttpError.Model = {
                status: 400,
                message: 'domain_user_id is required.',
            }
            throw error
        }

        const result: Widely.Model = await callingWidely(
            'get_mobiles',
            { domain_user_id: domain_user_id }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

const getMobileInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { endpoint_id } = req.body

        if (!endpoint_id) {
            const error: HttpError.Model = {
                status: 400,
                message: 'endpoint_id is required.',
            }
            throw error
        }

        const result: Widely.Model = await callingWidely(
            'get_mobile_info',
            { endpoint_id: endpoint_id }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

export { searchUsers, getMobiles, getMobileInfo }
