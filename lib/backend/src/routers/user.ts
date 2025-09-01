import { Router } from 'express'
import * as userController from '@controller/user'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const userRouter = Router()

userRouter.post('/', hasRole('admin'), AuditMiddleware.logCreate('users'), userController.createUser)
userRouter.get('/', hasRole('admin'), userController.getUsers)
userRouter.get('/:id', hasRole('admin'), userController.getUserById)
userRouter.put('/:id', hasRole('admin', 'branch'), AuditMiddleware.logUpdate('users'), userController.updateUser)
userRouter.delete('/:id', hasRole('admin'), AuditMiddleware.logDelete('users'), userController.deleteUser)

export default userRouter
