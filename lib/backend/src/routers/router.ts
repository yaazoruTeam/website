import { Router } from 'express';
import * as excelController from '../controller/excel';
import * as ApiTranzila from '../controller/ApiTranzila';
import * as MonthlyPaymentManagementController from '../controller/MonthlyPaymentManagement';

import customerRouter from './customer';
import deviceRouter from './device';
import customerDeviceRouter from './customerDevice';
import userRouter from './user';
import branchRouter from './branch';
import branchCustomerRouter from './branchCustomer';
import branchUserRouter from './branchUser';
import creditDetailsRouter from './creditDeatails';
import monthlyPaymentRouter from './monthlyPayment';
import paymentsRouter from './payments';
import itemRouter from './item'
import paymentCreditLinkRouter from './paymentCreditLink'
import authRouter from './auth'
import { errorHandler } from '../middleware/errorHandler';
import { hasRole } from '../middleware/auth';

const router = Router();
const ROUTE_PATH = '/controller';


router.use(`${ROUTE_PATH}/customer`, customerRouter);
router.use(`${ROUTE_PATH}/device`, deviceRouter);
router.use(`${ROUTE_PATH}/customerDevice`, customerDeviceRouter);
router.use(`${ROUTE_PATH}/user`, userRouter);
router.use(`${ROUTE_PATH}/branch`, branchRouter);
router.use(`${ROUTE_PATH}/branchCustomer`, branchCustomerRouter);
router.use(`${ROUTE_PATH}/branchUser`, branchUserRouter);
router.use(`${ROUTE_PATH}/creditDetails`, creditDetailsRouter);
router.use(`${ROUTE_PATH}/monthlyPayment`, monthlyPaymentRouter);
router.use(`${ROUTE_PATH}/payments`, paymentsRouter);
router.use(`${ROUTE_PATH}/item`, itemRouter);
router.use(`${ROUTE_PATH}/paymentCreditLink`, paymentCreditLinkRouter);
router.use(`${ROUTE_PATH}/auth`, authRouter);


router.get(`${ROUTE_PATH}/excel`, hasRole('admin'), excelController.handleReadExcelFile);

// router.post(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.createTransactionDetails);
// router.get(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.getTransactionDetails);
// router.get(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.getTransactionDetailsById);
// router.put(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);
// router.delete(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);

router.post(`${ROUTE_PATH}/addMonthlyPayment`,  MonthlyPaymentManagementController.createMonthlyPayment);
router.put(`${ROUTE_PATH}/updateMonthlyPayment/:id`,  MonthlyPaymentManagementController.updateMonthlyPayment);

router.post(`${ROUTE_PATH}/charge`, ApiTranzila.chargeTokenTranzila);

// router.post(`${ROUTE_PATH}/tranzila`, hasRole('admin'), tranzila.);

router.all('*', errorHandler)

export {
    router,
    ROUTE_PATH,
}
