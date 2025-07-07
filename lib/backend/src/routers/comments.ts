import { Router } from 'express'
import * as commentsController from '../controller/comment'
import { hasRole } from '../middleware/auth'

const commentRouter = Router()

commentRouter.post('/', hasRole('admin', 'branch'), commentsController.createComment)
commentRouter.get('/', hasRole('admin', 'branch'), commentsController.getComments)
commentRouter.get(
  '/:entity_type/:entity_id',
  hasRole('admin', 'branch'),
  commentsController.getCommentsByEntity,
)
commentRouter.get('/:id', hasRole('admin', 'branch'), commentsController.getCommentById)
commentRouter.put('/:id', hasRole('admin', 'branch'), commentsController.updateComment)
commentRouter.delete('/:id', hasRole('admin'), commentsController.deleteComment)

export default commentRouter
