import request from 'supertest';
import express from 'express';
import * as notesController from '../../controller/note';
import * as db from '../../db';
import { Note } from '../../model/src/Note';

jest.mock('../../db');

const app = express();
app.use(express.json());
app.post('/notes', notesController.createNote);
app.get('/notes', notesController.getNotes);
app.get('/notes/:id', notesController.getNoteById);
app.put('/notes/:id', notesController.updateNote);
app.delete('/notes/:id', notesController.deleteNote);

describe('Notes Controller', () => {
  const mockNote = {
    note_id: 1,
    entity_id: '123',
    entity_type: 'customer',
    content: 'Test note',
    created_at: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create note successfully', async () => {
    (db.Note.createNote as jest.Mock).mockResolvedValue(mockNote);
    const res = await request(app).post('/notes').send(mockNote);
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Test note');
  });

  it('should fail to create note with missing fields', async () => {
    const res = await request(app).post('/notes').send({});
    expect(res.status).toBe(400);
  });

  it('should get all notes', async () => {
    (db.Note.getNotes as jest.Mock).mockResolvedValue({
      notes: [mockNote],
      total: 1
    });
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1); // כאן!
  });

  it('should get note by id', async () => {
    (db.Note.getNoteById as jest.Mock).mockResolvedValue(mockNote);
    const res = await request(app).get('/notes/1');
    expect(res.status).toBe(200);
    expect(res.body.note_id).toBe(1);
  });

  it('should return 404 for missing note', async () => {
    (db.Note.getNoteById as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app).get('/notes/999');
    expect(res.status).toBe(404);
  });

  it('should update note', async () => {
    (db.Note.updateNote as jest.Mock).mockResolvedValue({ ...mockNote, content: 'Updated' });
    const res = await request(app).put('/notes/1').send({ ...mockNote, content: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated');
  });

  it('should delete note', async () => {
    (db.Note.deleteNote as jest.Mock).mockResolvedValue(mockNote);
    const res = await request(app).delete('/notes/1');
    expect(res.status).toBe(200);
    expect(res.body.note_id).toBe(1);
  });

  it('should return 404 when deleting non-existing note', async () => {
    (db.Note.deleteNote as jest.Mock).mockImplementation(() => { throw { status: 404, message: 'Note not found' }; });
    const res = await request(app).delete('/notes/999');
    expect(res.status).toBe(404);
  });
});