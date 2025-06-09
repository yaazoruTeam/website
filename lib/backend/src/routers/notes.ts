import { Router } from 'express';
import * as notesController from '../controller/note';
import { hasRole } from '../middleware/auth';

const noteRouter = Router();

noteRouter.post('/', hasRole('admin', 'branch'), notesController.createNote);
noteRouter.get('/', hasRole('admin', 'branch'), notesController.getNotes);
noteRouter.get('/:entity_type/:entity_id', hasRole('admin', 'branch'), notesController.getNotesByEntity);
noteRouter.get('/:id', hasRole('admin', 'branch'), notesController.getNoteById);
noteRouter.put('/:id', hasRole('admin', 'branch'), notesController.updateNote);
noteRouter.delete('/:id', hasRole('admin'), notesController.deleteNote);

export default noteRouter;
