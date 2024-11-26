import { Router } from 'express';
import * as customersController from '../controller/customer';

const router = Router();
const ROUTE_PATH = '/controller';

router.post(`${ROUTE_PATH}/customer`, customersController.createCustomer);
router.get(`${ROUTE_PATH}/customer`, customersController.getCustomers);
router.get(`${ROUTE_PATH}/customer/:id`, customersController.getCustomerById);
router.put(`${ROUTE_PATH}/customer/:id`, customersController.updateCustomer);
router.delete(`${ROUTE_PATH}/customer/:id`, customersController.deleteCustomer);

export {
    router,
    ROUTE_PATH,
}