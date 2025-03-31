import { Router } from 'express';
import * as authController from '../controller/AuthController';
import { hasRole } from '../middleware/auth';

const authRouter = Router();

authRouter.post(`/register`, hasRole('admin'), authController.register);
authRouter.post(`/login`, authController.login);
authRouter.post(`/refresh`, authController.refreshToken);

export default authRouter;
