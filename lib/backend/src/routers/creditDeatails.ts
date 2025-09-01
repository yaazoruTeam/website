import { Router } from 'express'
import * as creditDetailsController from '@controller/creditDetails'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const creditDetailsRouter = Router()

creditDetailsRouter.post('/', hasRole('admin'), AuditMiddleware.logCreate('credit_details'), creditDetailsController.createCreditDetails)
creditDetailsRouter.get('/', hasRole('admin'), creditDetailsController.getCreditDetails)
creditDetailsRouter.get('/:id', hasRole('admin'), creditDetailsController.getCreditDetailsById)
creditDetailsRouter.put('/:id', hasRole('admin'), AuditMiddleware.logUpdate('credit_details'), creditDetailsController.updateCreditDetails)
// creditDetailsRouter.delete('/:id', hasRole('admin'), branchController.deleteBranch);

export default creditDetailsRouter
