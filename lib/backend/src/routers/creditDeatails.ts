import { Router } from 'express';
import * as creditDetailsController from '../controller/creditDetails';
import { hasRole } from '../middleware/auth';

const creditDetailsRouter = Router();

creditDetailsRouter.post('/', hasRole('admin'), creditDetailsController.createCreditDetails);
creditDetailsRouter.get('/', hasRole('admin'), creditDetailsController.getCreditDetails);
creditDetailsRouter.get('/:id', hasRole('admin'), creditDetailsController.getCreditDetailsById);
creditDetailsRouter.put('/:id', hasRole('admin'), creditDetailsController.updateCreditDetails);
// creditDetailsRouter.delete('/:id', hasRole('admin'), branchController.deleteBranch);

export default creditDetailsRouter;
