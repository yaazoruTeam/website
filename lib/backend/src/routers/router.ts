import { Router, ErrorRequestHandler } from 'express';
import * as customersController from '../controller/customer';
import * as devicesController from '../controller/device';
import { errorHandler } from 'src/errorHandler';


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


router.all('*', errorHandler)

export {
    router,
    ROUTE_PATH,
}
