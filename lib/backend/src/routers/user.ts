import { Router } from 'express'
import * as userController from '@controller/user'
import { hasRole } from '@middleware/auth'

const userRouter = Router()

userRouter.post('/', hasRole('admin'), userController.createUser)
userRouter.get('/', hasRole('admin'), userController.getUsers)
userRouter.get('/:id', hasRole('admin'), userController.getUserById)
userRouter.put('/:id', hasRole('admin', 'branch'), userController.updateUser)
userRouter.delete('/:id', hasRole('admin'), userController.deleteUser)

export default userRouter
