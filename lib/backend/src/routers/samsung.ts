/**
 * Samsung Device Router
 * Routes for Samsung device management API endpoints
 */

import { Router } from 'express'
import * as samsungController from '@controller/samsung'
import { hasRole } from '@middleware/auth'

const samsungRouter = Router()

/**
 * Device Information Endpoints
 */
samsungRouter.get(
    '/devices/:serialNumber/info',
    hasRole('admin'),
    samsungController.getDeviceInfo
)

/**
 * Device Management Endpoints
 */
samsungRouter.post(
    '/devices/:serialNumber/moveToGroup',
    hasRole('admin'),
    samsungController.moveDeviceToGroup
)

samsungRouter.post(
    '/devices/:serialNumber/sync',
    hasRole('admin'),
    samsungController.syncDevice
)

/**
 * Group Management Endpoints
 */
samsungRouter.get(
    '/groups',
    hasRole('admin'),
    samsungController.getGroups
)

export default samsungRouter
