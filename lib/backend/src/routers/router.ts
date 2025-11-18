import { Router } from 'express'
import * as ApiTranzila from '@controller/ApiTranzila'
import * as MonthlyPaymentManagementController from '@controller/MonthlyPaymentManagement'

import customerRouter from './customer'
import deviceRouter from './device'
import userRouter from './user'
import simCardRouter from './simCard'
import branchRouter from './branch'
import branchCustomerRouter from './branchCustomer'
import branchUserRouter from './branchUser'
import creditDetailsRouter from './creditDeatails'
import monthlyPaymentRouter from './monthlyPayment'
import paymentsRouter from './payments'
import itemRouter from './item'
import paymentCreditLinkRouter from './paymentCreditLink'
import authRouter from './auth'
import { errorHandler } from '@middleware/errorHandler'
import commentRouter from './comments'
import widelyRouter from './widely'
import excelRouter from './excel'
import samsungRouter from './samsung'
import switchboardRouter from './switchboard'

const router = Router()
const ROUTE_PATH = '/controller'

router.use(`${ROUTE_PATH}/customer`, customerRouter)
router.use(`${ROUTE_PATH}/device`, deviceRouter)
router.use(`${ROUTE_PATH}/user`, userRouter)
router.use(`${ROUTE_PATH}/simCard`, simCardRouter)
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
router.use(`${ROUTE_PATH}/widely`, widelyRouter)
router.use(`${ROUTE_PATH}/excel`, excelRouter)
router.use(`${ROUTE_PATH}/samsung`, samsungRouter)
router.use(`${ROUTE_PATH}/switchboard`, switchboardRouter)


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
