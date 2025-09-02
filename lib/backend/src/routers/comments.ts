import { Router } from 'express';
import * as commentsController from '@controller/comment';
import { hasRole } from '@middleware/auth';
import AuditMiddleware from '../middleware/auditMiddleware';
import multer from 'multer';

const commentRouter = Router()

const upload = multer();

commentRouter.post('/transcribe', hasRole('admin', 'branch'), upload.single('audio'), commentsController.transcribeAudio);
commentRouter.post('/', hasRole('admin', 'branch'), AuditMiddleware.logCreate('comments'), commentsController.createComment);
commentRouter.get('/', hasRole('admin', 'branch'), commentsController.getComments);
commentRouter.get('/:entity_type/:entity_id', hasRole('admin', 'branch'), commentsController.getCommentsByEntity);
commentRouter.get('/:id', hasRole('admin', 'branch'), commentsController.getCommentById);
commentRouter.put('/:id', hasRole('admin', 'branch'), AuditMiddleware.logUpdate('comments'), commentsController.updateComment);
commentRouter.delete('/:id', hasRole('admin'), AuditMiddleware.logDelete('comments'), commentsController.deleteComment);

export default commentRouter
