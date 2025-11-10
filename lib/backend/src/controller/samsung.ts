/**
 * Samsung Device Controller
 * Handles all Samsung API requests
 */

import { Request, Response, NextFunction } from 'express'
import { handleError } from './err'
import SamsungService from '@integration/samsung/SamsungService'
import logger from '@/src/utils/logger'

/**
 * GET /samsung/devices/:serialNumber/info
 * Get device information by serial number
 */
const getDeviceInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serialNumber } = req.params

        if (!serialNumber) {
            throw { status: 400, message: 'serialNumber is required' }
        }

        logger.info(`Controller: Getting device info for ${serialNumber}`)
        const deviceInfo = await SamsungService.getDeviceInfo(serialNumber)

        res.status(200).json(deviceInfo)
    } catch (error: unknown) {
        handleError(error, next)
    }
}

/**
 * POST /samsung/devices/:serialNumber/moveToGroup
 * Move device to a different group
 */
const moveDeviceToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serialNumber } = req.params
        const { groupId } = req.body

        if (!serialNumber) {
            throw { status: 400, message: 'serialNumber is required' }
        }

        if (!groupId) {
            throw { status: 400, message: 'groupId is required' }
        }

        logger.info(`Controller: Moving device ${serialNumber} to group ${groupId}`)
        const result = await SamsungService.moveDeviceToGroup(serialNumber, { groupId })

        res.status(200).json(result)
    } catch (error: unknown) {
        handleError(error, next)
    }
}

/**
 * POST /samsung/devices/:serialNumber/sync
 * Sync device with server
 */
const syncDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serialNumber } = req.params
        const { forceSync } = req.body

        if (!serialNumber) {
            throw { status: 400, message: 'serialNumber is required' }
        }

        logger.info(`Controller: Syncing device ${serialNumber}`)
        const result = await SamsungService.syncDevice(serialNumber, { forceSync })

        res.status(200).json(result)
    } catch (error: unknown) {
        handleError(error, next)
    }
}

/**
 * GET /samsung/groups
 * Get all device groups
 */
const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { exclude } = req.query
        const excludeGroupId = exclude ? Number(exclude) : undefined

        logger.info(`Controller: Getting groups list${excludeGroupId ? ` (excluding ${excludeGroupId})` : ''}`)
        const groups = await SamsungService.getGroups(excludeGroupId)

        res.status(200).json(groups)
    } catch (error: unknown) {
        handleError(error, next)
    }
}

export { getDeviceInfo, moveDeviceToGroup, syncDevice, getGroups }
