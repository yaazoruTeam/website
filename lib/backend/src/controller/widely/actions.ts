import { NextFunction, Request, Response } from 'express'
import { Widely } from '../../model/src'
import { callingWidely } from '../../integration/widely/callingWidely'
import { validateRequiredParam } from '../../utils/widelyValidation'

const terminateMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { endpoint_id } = req.body
        validateRequiredParam(endpoint_id, 'endpoint_id')
        
        const result: Widely.Model = await callingWidely(
            'prov_terminate_mobile',
            { endpoint_id: endpoint_id }
        )
        res.status(result.error_code).json(result)
    } catch (error: any) {
        next(error)
    }
}

export { terminateMobile }
