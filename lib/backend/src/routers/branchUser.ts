import { Router } from 'express';
import * as branchUserController from '../controller/branchUser';
import { hasRole } from '../middleware/auth';

const branchUserRouter = Router();

branchUserRouter.post('/', hasRole('admin'), branchUserController.createBranchUser);
branchUserRouter.get('/', hasRole('admin'), branchUserController.getAllBranchUser);
branchUserRouter.get('/:id', hasRole('admin'), branchUserController.getBranchUserById);
branchUserRouter.get('/branch/:id', hasRole('admin'), branchUserController.getBranchUserByBranch_id);
branchUserRouter.get('/user/:id', hasRole('admin'), branchUserController.getBranchUserByUser_id);
branchUserRouter.put('/:id', hasRole('admin'), branchUserController.updateBranchUser);
branchUserRouter.delete('/:id', hasRole('admin'), branchUserController.deleteBranchUser);

export default branchUserRouter;
