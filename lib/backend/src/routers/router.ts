import { Router } from 'express';
import * as customersController from '../controller/customer';
import * as devicesController from '../controller/device';
import * as customerDevicesController from '../controller/customerDevice';
import * as userController from '../controller/user';
import * as authController from '../controller/AuthController';
import { errorHandler } from '../Middleware/errorHandler';
import { hasRole } from '../Middleware/auth';


const router = Router();
const ROUTE_PATH = '/controller';

router.post(`${ROUTE_PATH}/customer`, hasRole('admin', 'branch'), customersController.createCustomer);
router.get(`${ROUTE_PATH}/customer`, hasRole('admin'), customersController.getCustomers);
router.get(`${ROUTE_PATH}/customer/:id`, hasRole('admin'), customersController.getCustomerById);
router.put(`${ROUTE_PATH}/customer/:id`, hasRole('admin', 'branch'), customersController.updateCustomer);
router.delete(`${ROUTE_PATH}/customer/:id`, hasRole('admin'), customersController.deleteCustomer);

router.post(`${ROUTE_PATH}/device`, hasRole('admin'), devicesController.createDevice);
router.get(`${ROUTE_PATH}/device`, hasRole('admin'), devicesController.getDevices);
router.get(`${ROUTE_PATH}/device/:id`, hasRole('admin'), devicesController.getDeviceById);
router.put(`${ROUTE_PATH}/device/:id`, hasRole('admin', 'branch'), devicesController.updateDevice);
router.delete(`${ROUTE_PATH}/device/:id`, hasRole('admin'), devicesController.deleteDevice);

router.post(`${ROUTE_PATH}/customerDevice`, hasRole('admin', 'branch'), customerDevicesController.createCustomerDevice);
router.get(`${ROUTE_PATH}/customerDevice`, hasRole('admin'), customerDevicesController.getCustomersDevices);
router.get(`${ROUTE_PATH}/customerDevice/:id`, hasRole('admin'), customerDevicesController.getCustomerDeviceById);
router.get(`${ROUTE_PATH}/customerDevice/allDevices/:id`, customerDevicesController.getAllDevicesByCustomerId);
router.put(`${ROUTE_PATH}/customerDevice/:id`, hasRole('admin', 'branch'), customerDevicesController.updateCustomerDevice);
router.delete(`${ROUTE_PATH}/customerDevice/:id`, hasRole('admin', 'branch'), customerDevicesController.deleteCustomerDevice);

router.post(`${ROUTE_PATH}/user`, hasRole('admin'), userController.createUser);
router.get(`${ROUTE_PATH}/user`, hasRole('admin'), userController.getUsers);
router.get(`${ROUTE_PATH}/user/:id`, hasRole('admin'), userController.getUserById);
router.put(`${ROUTE_PATH}/user/:id`, hasRole('admin', 'branch'), userController.updateUser);
router.delete(`${ROUTE_PATH}/user/:id`, hasRole('admin'), userController.deleteUser);

router.post(`${ROUTE_PATH}/register`, hasRole('admin'), authController.register);
router.post(`${ROUTE_PATH}/login`, authController.login);
router.post(`${ROUTE_PATH}/refresh`, authController.refreshToken);


router.all('*', errorHandler)

export {
    router,
    ROUTE_PATH,
}
