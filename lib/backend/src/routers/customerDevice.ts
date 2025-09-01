import { Router } from 'express'
import * as customerDevicesController from '@controller/customerDevice'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const customerDeviceRouter = Router()

customerDeviceRouter.post(
  '/',
  hasRole('admin', 'branch'),
  AuditMiddleware.logCreate('customer_devices'),
  customerDevicesController.createCustomerDevice,
)
customerDeviceRouter.get('/', hasRole('admin'), customerDevicesController.getCustomersDevices)
customerDeviceRouter.get('/:id', hasRole('admin'), customerDevicesController.getCustomerDeviceById)
customerDeviceRouter.get('/allDevices/:id', customerDevicesController.getAllDevicesByCustomerId)
customerDeviceRouter.get('/device/:id', customerDevicesController.getCustomerIdByDeviceId)
customerDeviceRouter.put('/:id', AuditMiddleware.logUpdate('customer_devices'), customerDevicesController.updateCustomerDevice)
customerDeviceRouter.delete('/:id', AuditMiddleware.logDelete('customer_devices'), customerDevicesController.deleteCustomerDevice)

export default customerDeviceRouter
