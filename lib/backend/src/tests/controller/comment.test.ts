import request from 'supertest';
import express from 'express';
import * as commentsController from '../../controller/comment';
import * as db from '../../db';
import { Comment } from '../../model';

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

describe('Comment Model - sanitize function', () => {
  const validComment = {
    entity_id: '123',
    entity_type: 'customer' as const,
    content: 'Test comment',
    created_at: new Date()
  };

  describe('Validation errors', () => {
    it('should throw error when comment_id is required but missing', () => {
      expect(() => {
        Comment.sanitize(validComment, true);
      }).toThrow('Comment ID is required and must be a valid number.');
    });

    it('should throw error for missing entity_id', () => {
      const invalidComment = { ...validComment, entity_id: '' };
      expect(() => {
        Comment.sanitize(invalidComment, false);
      }).toThrow('Entity ID is required and must be a non-empty string.');
    });

    it('should throw error for invalid entity_type', () => {
      const invalidComment = { ...validComment, entity_type: 'invalid' as any };
      expect(() => {
        Comment.sanitize(invalidComment, false);
      }).toThrow('Entity type "invalid" is invalid. Allowed values are: customer, device, branch.');
    });

    it('should throw error for empty content', () => {
      const invalidComment = { ...validComment, content: '' };
      expect(() => {
        Comment.sanitize(invalidComment, false);
      }).toThrow('Comment content is required and must be a non-empty string.');
    });

    it('should successfully sanitize valid comment', () => {
      const result = Comment.sanitize(validComment, false);
      expect(result.entity_id).toBe('123');
      expect(result.entity_type).toBe('customer');
      expect(result.content).toBe('Test comment');
    });
  });
});