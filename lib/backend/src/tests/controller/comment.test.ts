import request from 'supertest';
import express from 'express';
import * as commentsController from '../../controller/comment';
import * as db from '../../db';

jest.mock('../../db');

const app = express();
app.use(express.json());
app.post('/comments', commentsController.createComment);
app.get('/comments', commentsController.getComments);
app.get('/comments/:id', commentsController.getCommentById);
app.put('/comments/:id', commentsController.updateComment);
app.delete('/comments/:id', commentsController.deleteComment);

describe('Comments Controller', () => {
  const mockComment = {
    comment_id: 1,
    entity_id: '123',
    entity_type: 'customer',
    content: 'Test comment',
    created_at: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create comment successfully', async () => {
    (db.Comment.createComment as jest.Mock).mockResolvedValue(mockComment);
    const res = await request(app).post('/comments').send(mockComment);
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Test comment');
  });

  it('should fail to create comment with missing fields', async () => {
    const res = await request(app).post('/comments').send({});
    expect(res.status).toBe(400);
  });

  it('should get all comments', async () => {
    (db.Comment.getComments as jest.Mock).mockResolvedValue({
      comments: [mockComment],
      total: 1
    });
    const res = await request(app).get('/comments');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should get comment by id', async () => {
    (db.Comment.getCommentById as jest.Mock).mockResolvedValue(mockComment);
    const res = await request(app).get('/comments/1');
    expect(res.status).toBe(200);
    expect(res.body.comment_id).toBe(1);
  });

  it('should return 404 for missing comment', async () => {
    (db.Comment.getCommentById as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app).get('/comments/999');
    expect(res.status).toBe(404);
  });

  it('should update comment', async () => {
    (db.Comment.updateComment as jest.Mock).mockResolvedValue({ ...mockComment, content: 'Updated' });
    const res = await request(app).put('/comments/1').send({ ...mockComment, content: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated');
  });

  it('should delete comment', async () => {
    (db.Comment.deleteComment as jest.Mock).mockResolvedValue(mockComment);
    const res = await request(app).delete('/comments/1');
    expect(res.status).toBe(200);
    expect(res.body.comment_id).toBe(1);
  });

  it('should return 404 when deleting non-existing comment', async () => {
    (db.Comment.deleteComment as jest.Mock).mockImplementation(() => { throw { status: 404, message: 'Comment not found' }; });
    const res = await request(app).delete('/comments/999');
    expect(res.status).toBe(404);
  });
});