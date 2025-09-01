import { Router } from 'express'
import * as branchController from '@controller/branch'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const branchRouter = Router()

branchRouter.post('/', hasRole('admin'), AuditMiddleware.logCreate('branches'), branchController.createBranch)
branchRouter.get('/', hasRole('admin'), branchController.getBranches)
branchRouter.get('/city/:city', hasRole('admin'), branchController.getBranchesByCity)
branchRouter.get('/:id', hasRole('admin'), branchController.getBranchById)
branchRouter.put('/:id', hasRole('admin'), AuditMiddleware.logUpdate('branches'), branchController.updateBranch)
branchRouter.delete('/:id', hasRole('admin'), AuditMiddleware.logDelete('branches'), branchController.deleteBranch)

export default branchRouter
