import { Router } from 'express'
import * as devicesController from '@controller/device'
import { hasRole } from '@middleware/auth'

const deviceRouter = Router()

deviceRouter.post('/', hasRole('admin'), devicesController.createDevice)
deviceRouter.get('/page/:page', hasRole('admin'), devicesController.getDevices)
deviceRouter.get('/status/:status/page/:page', hasRole('admin'), devicesController.getDevicesByStatus)
deviceRouter.get('/:id', hasRole('admin'), devicesController.getDeviceById)
deviceRouter.put('/:id', hasRole('admin', 'branch'), devicesController.updateDevice)
deviceRouter.delete('/:id', hasRole('admin'), devicesController.deleteDevice)

export default deviceRouter
