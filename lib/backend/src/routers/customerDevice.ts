import { Router } from 'express'
import * as customerDevicesController from '@controller/customerDevice'
import { hasRole } from '@middleware/auth'

const customerDeviceRouter = Router()

// POST - Create
customerDeviceRouter.post(
  '/',
  hasRole('admin', 'branch'),
  customerDevicesController.createCustomerDevice,
)

// GET - Specific routes FIRST (before generic /:id)
customerDeviceRouter.get('/page/:page', hasRole('admin'), customerDevicesController.getCustomersDevices)
customerDeviceRouter.get('/allDevices/:id/page/:page', customerDevicesController.getAllDevicesByCustomerId)
customerDeviceRouter.get('/device/:id/page/:page', customerDevicesController.getCustomerIdByDeviceId)

// GET - Generic routes LAST
customerDeviceRouter.get('/:id', hasRole('admin'), customerDevicesController.getCustomerDeviceById)

// PUT & DELETE
customerDeviceRouter.put('/:id', customerDevicesController.updateCustomerDevice)
customerDeviceRouter.delete('/:id', customerDevicesController.deleteCustomerDevice)

export default customerDeviceRouter
