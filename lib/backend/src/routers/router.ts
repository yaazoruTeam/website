import { Router } from 'express'
import * as excelController from '../controller/excel'
import * as ApiTranzila from '../controller/ApiTranzila'
import * as MonthlyPaymentManagementController from '../controller/MonthlyPaymentManagement'

import customerRouter from './customer'
import deviceRouter from './device'
import customerDeviceRouter from './customerDevice'
import userRouter from './user'
import branchRouter from './branch'
import branchCustomerRouter from './branchCustomer'
import branchUserRouter from './branchUser'
import creditDetailsRouter from './creditDeatails'
import monthlyPaymentRouter from './monthlyPayment'
import paymentsRouter from './payments'
import itemRouter from './item'
import paymentCreditLinkRouter from './paymentCreditLink'
import authRouter from './auth'
import { errorHandler } from '../middleware/errorHandler'
import { hasRole } from '../middleware/auth'
import commentRouter from './comments'
import {  changeNetworkPreference, getEndpointUsage, getMobileInfo, getMobiles, getPackagesWithInfo, resetLine, resetVoicemailPin, searchUserByIccid, searchUsers, sendApn, sendMobileAction, sendPing, terminateMobile, toggleLineStatus, updateMobileSubscription } from '../telecom/ping'
// import { sendApn } from 'service/telecom'

const router = Router()
const ROUTE_PATH = '/controller'
sendPing()
// confirmIccid('89972123300003289709')
// getMobileByIccidFromList('89972123300003289709')
// getDids('400061870')
// generalSearch('89972123300003289709')
// sendMobileAction()
// getActionMobileInfo()
// getMobiles(400094893)
// getUsers()
// searchUserByIccid('89972123300003312030')//✅נתונים של מידע
// getDidInfoByEndpoint(400055892)
// getUserSubscriptions(400061870)
//  getEndpointUsage(400086408)
// getMobileInfo(400090993)//✅נתונים של מידע
// terminateMobile(400090692)//endpointId//ביטול קו
// sendApn(400086408)//endpointId//שליחת APN
// resetVoicemailPin(400086408)//endpointId//איפוס סיסמת תא קולי//✅✅✅✅✅
// toggleLineStatus(400086408, false)//endpointId,action(להדליק קו או לכבות)//הדלקת קו/השעיית קו✅✅✅✅✅????
// softResetSim(400055892)//endpointId//איפוס SIM רך??
// hardResetSim(400055892)//endpointId//איפוס SIM קשה??
updateMobileSubscription(400090993,400000291)//endpointId,service_id//עדכון מנוי נייד//החלפת תוכנית
// getPackagesWithInfo()//-reseller_domain_id-לבדוק מאיפה זה מגיע, פונקציה לקבלת של התוכניות צריך את זה בשביל לקבל את כל סוגי התוכניות בשביל החלפת תוכנית
// searchUsers(89972123300003312030)
//  resetLine(400090992)                                                                                                                      
                                                                                                                            
// changeNetworkPreference(400090993, 'hot_partner')

router.use(`${ROUTE_PATH}/customer`, customerRouter)
router.use(`${ROUTE_PATH}/device`, deviceRouter)
router.use(`${ROUTE_PATH}/customerDevice`, customerDeviceRouter)
router.use(`${ROUTE_PATH}/user`, userRouter)
router.use(`${ROUTE_PATH}/branch`, branchRouter)
router.use(`${ROUTE_PATH}/branchCustomer`, branchCustomerRouter)
router.use(`${ROUTE_PATH}/branchUser`, branchUserRouter)
router.use(`${ROUTE_PATH}/creditDetails`, creditDetailsRouter)
router.use(`${ROUTE_PATH}/monthlyPayment`, monthlyPaymentRouter)
router.use(`${ROUTE_PATH}/payments`, paymentsRouter)
router.use(`${ROUTE_PATH}/item`, itemRouter)
router.use(`${ROUTE_PATH}/paymentCreditLink`, paymentCreditLinkRouter)
router.use(`${ROUTE_PATH}/auth`, authRouter)
router.use(`${ROUTE_PATH}/comment`, commentRouter)

router.get(`${ROUTE_PATH}/excel`, hasRole('admin'), excelController.handleReadExcelFile)

// router.post(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.createTransactionDetails);
// router.get(`${ROUTE_PATH}/transactionDetails`, hasRole('admin'), TransactionDetailsController.getTransactionDetails);
// router.get(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.getTransactionDetailsById);
// router.put(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);
// router.delete(`${ROUTE_PATH}/transactionDetails/:id`, hasRole('admin'), TransactionDetailsController.updateTransactionDetails);

router.post(
  `${ROUTE_PATH}/addMonthlyPayment`,
  MonthlyPaymentManagementController.createMonthlyPayment,
)
router.put(
  `${ROUTE_PATH}/updateMonthlyPayment/:id`,
  MonthlyPaymentManagementController.updateMonthlyPayment,
)

router.post(`${ROUTE_PATH}/charge`, ApiTranzila.chargeTokenTranzila)

// router.post(`${ROUTE_PATH}/tranzila`, hasRole('admin'), tranzila.);

router.all('*', errorHandler)

export { router, ROUTE_PATH }
