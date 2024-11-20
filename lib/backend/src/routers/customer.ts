import { Router } from 'express';
import * as customersController from '../controller/customer';

const router = Router();

router.post('/', customersController.createCustomer);
router.get('/', customersController.getCustomers);

export default router;