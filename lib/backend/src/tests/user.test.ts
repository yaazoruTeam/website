import request from 'supertest';
import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controller/user';
import * as db from '../../src/db';
import { User } from '../model';
import { hashPassword } from '../utils/password';

jest.mock('../db');
jest.mock('../utils/password');
jest.mock('../model');

const app = express();
app.use(express.json());
app.post('/users', createUser);
app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

describe('User Controller', () => {
  const mockUser = {
    user_id: '123',
    user_name: 'testuser',
    email: 'test@example.com',
    id_number: '123456789',
    password: 'plainPassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      (User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (User.sanitize as jest.Mock).mockReturnValue(mockUser);
      (db.User.findUser as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (db.User.createUser as jest.Mock).mockResolvedValue({ ...mockUser, password: 'hashedPassword' });

      const res = await request(app).post('/users').send(mockUser);
      expect(res.status).toBe(201);
      expect(res.body.password).toBe('hashedPassword');
    });

    it('should handle user already exists', async () => {
      (User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (User.sanitize as jest.Mock).mockReturnValue(mockUser);
      (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
      (User.sanitizeExistingUser as jest.Mock).mockImplementation(() => {
        throw { status: 400, message: 'User already exists' };
      });

      const res = await request(app).post('/users').send(mockUser);
      expect(res.status).toBe(400);
    });

    it('should handle general error', async () => {
      (User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { throw new Error('Fail') });

      const res = await request(app).post('/users').send(mockUser);
      expect(res.status).toBe(500);
    });
  });

  describe('getUsers', () => {
    it('should return users list', async () => {
      (db.User.getUsers as jest.Mock).mockResolvedValue([mockUser]);
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle DB error', async () => {
      (db.User.getUsers as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
      (db.User.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get('/users/123');
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 404 if user does not exist', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.User.doesUserExist as jest.Mock).mockResolvedValue(false);

      const res = await request(app).get('/users/123');
      expect(res.status).toBe(404);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (User.sanitize as jest.Mock).mockReturnValue({ ...mockUser, password: 'hashedPassword' });
      (db.User.findUser as jest.Mock).mockResolvedValue(null);
      (db.User.updateUser as jest.Mock).mockResolvedValue({ ...mockUser, user_name: 'updatedName' });

      const res = await request(app).put('/users/123').send({ ...mockUser, password: 'newPassword' });
      expect(res.status).toBe(200);
      expect(res.body.user_name).toBe('updatedName');
    });

    it('should handle update error', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (User.sanitize as jest.Mock).mockReturnValue(mockUser);
      (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
      (User.sanitizeExistingUser as jest.Mock).mockImplementation(() => {
        throw { status: 400, message: 'User exists with same data' };
      });

      const res = await request(app).put('/users/123').send(mockUser);
      expect(res.status).toBe(400);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
      (db.User.deleteUser as jest.Mock).mockResolvedValue({ message: 'Deleted' });

      const res = await request(app).delete('/users/123');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Deleted');
    });

    it('should return 404 if user not found', async () => {
      (User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.User.doesUserExist as jest.Mock).mockResolvedValue(false);

      const res = await request(app).delete('/users/123');
      expect(res.status).toBe(404);
    });
  });
});
