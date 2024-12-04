import { Router } from 'express';
import * as customersController from '../controller/customer';
import * as devicesController from '../controller/device';
import * as customerDevicesController from '../controller/customerDevice';
import * as userController from '../controller/user';
import { errorHandler } from '../errorHandler';


const router = Router();
const ROUTE_PATH = '/controller';

router.post(`${ROUTE_PATH}/customer`, customersController.createCustomer);
router.get(`${ROUTE_PATH}/customer`, customersController.getCustomers);
router.get(`${ROUTE_PATH}/customer/:id`, customersController.getCustomerById);
router.put(`${ROUTE_PATH}/customer/:id`, customersController.updateCustomer);
router.delete(`${ROUTE_PATH}/customer/:id`, customersController.deleteCustomer);

router.post(`${ROUTE_PATH}/device`, devicesController.createDevice);
router.get(`${ROUTE_PATH}/device`, devicesController.getDevices);
router.get(`${ROUTE_PATH}/device/:id`, devicesController.getDeviceById);
router.put(`${ROUTE_PATH}/device/:id`, devicesController.updateDevice);
router.delete(`${ROUTE_PATH}/device/:id`, devicesController.deleteDevice);

router.post(`${ROUTE_PATH}/customerDevice`, customerDevicesController.createCustomerDevice);
router.get(`${ROUTE_PATH}/customerDevice`, customerDevicesController.getCustomersDevices);
router.get(`${ROUTE_PATH}/customerDevice/:id`, customerDevicesController.getCustomerDeviceById);
router.get(`${ROUTE_PATH}/customerDevice/allDevices/:id`, customerDevicesController.getAllDevicesByCustomerId);
router.put(`${ROUTE_PATH}/customerDevice/:id`, customerDevicesController.updateCustomerDevice);
router.delete(`${ROUTE_PATH}/customerDevice/:id`, customerDevicesController.deleteCustomerDevice);

router.post(`${ROUTE_PATH}/user`, userController.createUser);
router.get(`${ROUTE_PATH}/user`, userController.getUsers);
router.get(`${ROUTE_PATH}/user/:id`, userController.getUserById);
router.put(`${ROUTE_PATH}/user/:id`, userController.updateUser);
router.delete(`${ROUTE_PATH}/user/:id`, userController.deleteUser);

router.all('*', errorHandler)

export {
    router,
    ROUTE_PATH,
}
