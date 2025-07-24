import { Router } from 'express'
import * as branchCustomerController from '@controller/branchCustomer'
import { hasRole } from '@middleware/auth'

const branchCustomerRouter = Router()

branchCustomerRouter.post('/', hasRole('admin'), branchCustomerController.createBranchCustomer)
branchCustomerRouter.get('/', hasRole('admin'), branchCustomerController.getAllBranchCustomer)
branchCustomerRouter.get('/:id', hasRole('admin'), branchCustomerController.getBranchCustomerById)
branchCustomerRouter.get(
  '/branch/:id',
  hasRole('admin'),
  branchCustomerController.getBranchCustomerByBranch_id,
)
branchCustomerRouter.get(
  '/customer/:id',
  hasRole('admin'),
  branchCustomerController.getBranchCustomerByCustomer_id,
)
branchCustomerRouter.put('/:id', hasRole('admin'), branchCustomerController.updateBranchCustomer)
branchCustomerRouter.delete('/:id', hasRole('admin'), branchCustomerController.deleteBranchCustomer)

export default branchCustomerRouter
