import { Router } from 'express'
import * as devicesController from '@controller/device'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const deviceRouter = Router()

deviceRouter.post('/', hasRole('admin'), AuditMiddleware.logCreate('devices'), devicesController.createDevice)
deviceRouter.get('/', hasRole('admin'), devicesController.getDevices)
deviceRouter.get('/status/:status', hasRole('admin'), devicesController.getDevicesByStatus)
deviceRouter.get('/:id', hasRole('admin'), devicesController.getDeviceById)
deviceRouter.put('/:id', hasRole('admin', 'branch'), AuditMiddleware.logUpdate('devices'), devicesController.updateDevice)
deviceRouter.delete('/:id', hasRole('admin'), AuditMiddleware.logDelete('devices'), devicesController.deleteDevice)

export default deviceRouter
