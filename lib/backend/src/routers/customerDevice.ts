import { Router } from 'express';
import * as customerDevicesController from '../controller/customerDevice';
import { hasRole } from '../middleware/auth';

const customerDeviceRouter = Router();

customerDeviceRouter.post('/', hasRole('admin', 'branch'), customerDevicesController.createCustomerDevice);
customerDeviceRouter.get('/', hasRole('admin'), customerDevicesController.getCustomersDevices);
customerDeviceRouter.get('/:id', hasRole('admin'), customerDevicesController.getCustomerDeviceById);
customerDeviceRouter.get('/allDevices/:id', customerDevicesController.getAllDevicesByCustomerId);
customerDeviceRouter.get('/device/:id', customerDevicesController.getCustomerIdByDeviceId);
customerDeviceRouter.put('/:id', customerDevicesController.updateCustomerDevice);
customerDeviceRouter.delete('/:id', customerDevicesController.deleteCustomerDevice);

export default customerDeviceRouter;
