import { Router } from 'express';
import * as customersController from '../controller/customer';
import * as devicesController from '../controller/device';
import * as customerDevicesController from '../controller/customerDevice';
import * as userController from '../controller/user';
import * as authController from '../controller/AuthController';
import * as branchController from '../controller/branch';
import * as branchCustomerController from '../controller/branchCustomer';
import * as branchUserController from '../controller/branchUser';
import * as excelController from '../controller/excel';
import * as creditDetailsController from '../controller/creditDetails';
import * as TransactionDetailsController from '../controller/TransactionDetails';
import { errorHandler } from '../middleware/errorHandler';
import { hasRole } from '../middleware/auth';

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
router.get(`${ROUTE_PATH}/customerDevice/device/:id`, customerDevicesController.getCustomerIdByDeviceId);
router.put(`${ROUTE_PATH}/customerDevice/:id`, customerDevicesController.updateCustomerDevice);
router.delete(`${ROUTE_PATH}/customerDevice/:id`, customerDevicesController.deleteCustomerDevice);

router.post(`${ROUTE_PATH}/user`, hasRole('admin'), userController.createUser);
router.get(`${ROUTE_PATH}/user`, hasRole('admin'), userController.getUsers);
router.get(`${ROUTE_PATH}/user/:id`, hasRole('admin'), userController.getUserById);
router.put(`${ROUTE_PATH}/user/:id`, hasRole('admin', 'branch'), userController.updateUser);
router.delete(`${ROUTE_PATH}/user/:id`, hasRole('admin'), userController.deleteUser);

router.post(`${ROUTE_PATH}/register`, hasRole('admin'), authController.register);
router.post(`${ROUTE_PATH}/login`, authController.login);
router.post(`${ROUTE_PATH}/auth/refresh`, authController.refreshToken);

router.post(`${ROUTE_PATH}/branch`, hasRole('admin'), branchController.createBranch);
router.get(`${ROUTE_PATH}/branch`, hasRole('admin'), branchController.getBranches);
router.get(`${ROUTE_PATH}/branch/:id`, hasRole('admin'), branchController.getBranchById);
router.put(`${ROUTE_PATH}/branch/:id`, hasRole('admin'), branchController.updateBranch);
router.delete(`${ROUTE_PATH}/branch/:id`, hasRole('admin'), branchController.deleteBranch);

router.post(`${ROUTE_PATH}/branchCustomer`, hasRole('admin'), branchCustomerController.createBranchCustomer);
router.get(`${ROUTE_PATH}/branchCustomer`, hasRole('admin'), branchCustomerController.getAllBranchCustomer);
router.get(`${ROUTE_PATH}/branchCustomer/:id`, hasRole('admin'), branchCustomerController.getBranchCustomerById);
router.get(`${ROUTE_PATH}/branchCustomer/branch/:id`, hasRole('admin'), branchCustomerController.getBranchCustomerByBranch_id);
router.get(`${ROUTE_PATH}/branchCustomer/customer/:id`, hasRole('admin'), branchCustomerController.getBranchCustomerByCustomer_id);
router.put(`${ROUTE_PATH}/branchCustomer/:id`, hasRole('admin'), branchCustomerController.updateBranchCustomer);
router.delete(`${ROUTE_PATH}/branchCustomer/:id`, hasRole('admin'), branchCustomerController.deleteBranchCustomer);

router.post(`${ROUTE_PATH}/branchUser`, hasRole('admin'), branchUserController.createBranchUser);
router.get(`${ROUTE_PATH}/branchUser`, hasRole('admin'), branchUserController.getAllBranchUser);
router.get(`${ROUTE_PATH}/branchUser/:id`, hasRole('admin'), branchUserController.getBranchUserById);
router.get(`${ROUTE_PATH}/branchUser/branch/:id`, hasRole('admin'), branchUserController.getBranchUserByBranch_id);
router.get(`${ROUTE_PATH}/branchUser/user/:id`, hasRole('admin'), branchUserController.getBranchUserByUser_id);
router.put(`${ROUTE_PATH}/branchUser/:id`, hasRole('admin'), branchUserController.updateBranchUser);
router.delete(`${ROUTE_PATH}/branchUser/:id`, hasRole('admin'), branchUserController.deleteBranchUser);

router.get(`${ROUTE_PATH}/excel`, hasRole('admin'), excelController.handleReadExcelFile);

router.post(`${ROUTE_PATH}/creditDetails`, hasRole('admin'), creditDetailsController.createCreditDetails);
router.get(`${ROUTE_PATH}/creditDetails`, hasRole('admin'), creditDetailsController.getCreditDetails);
router.get(`${ROUTE_PATH}/creditDetails/:id`, hasRole('admin'), creditDetailsController.getCreditDetailsById);
router.put(`${ROUTE_PATH}/creditDetails/:id`, hasRole('admin'), creditDetailsController.updateCreditDetails);
// router.delete(`${ROUTE_PATH}/creditDetails/:id`, hasRole('admin'), branchController.deleteBranch);

router.post(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.createTransactionDetails);
router.get(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.getTransactionDetails);
router.get(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.getTransactionDetailsById);
router.put(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);
router.delete(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);

router.all('*', errorHandler)

export {
    router,
    ROUTE_PATH,
}
