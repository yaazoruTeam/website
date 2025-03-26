import { Router } from 'express';
import * as monthlyPaymentController from '../controller/monthlypayment';
import { hasRole } from '../middleware/auth';

const monthlyPaymentRouter = Router();

monthlyPaymentRouter.post('/', monthlyPaymentController.createMonthlyPayment);
monthlyPaymentRouter.get('/', monthlyPaymentController.getMonthlyPayments);
monthlyPaymentRouter.get('/status/:status', monthlyPaymentController.getMonthlyPaymentsByStatus);
monthlyPaymentRouter.get('/:id', monthlyPaymentController.getMonthlyPaymentId);
monthlyPaymentRouter.put('/:id', monthlyPaymentController.updateMonthlyPayment);
monthlyPaymentRouter.delete('/:id', monthlyPaymentController.deleteMonthlyPayment);

export default monthlyPaymentRouter;
