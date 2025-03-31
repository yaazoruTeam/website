import { Router } from 'express';
import * as branchController from '../controller/branch';
import { hasRole } from '../middleware/auth';

const branchRouter = Router();

branchRouter.post('/', hasRole('admin'), branchController.createBranch);
branchRouter.get('/', hasRole('admin'), branchController.getBranches);
branchRouter.get('/city/:city', hasRole('admin'), branchController.getBranchesByCity);
branchRouter.get('/:id', hasRole('admin'), branchController.getBranchById);
branchRouter.put('/:id', hasRole('admin'), branchController.updateBranch);
branchRouter.delete('/:id', hasRole('admin'), branchController.deleteBranch);

export default branchRouter;
