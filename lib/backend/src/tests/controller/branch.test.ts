import request from 'supertest';
import express from 'express';
import {
  createBranch,
  getBranches,
  getBranchById,
  getBranchesByCity,
  updateBranch,
  deleteBranch,
} from '../../controller/branch';
import * as db from '../../db';
import { Branch } from '../../model';

jest.mock('../../db');
jest.mock('../../model');

const app = express();
app.use(express.json());
app.post('/branches', createBranch);
app.get('/branches', getBranches);
app.get('/branches/:id', getBranchById);
app.get('/branches/city/:city', getBranchesByCity);
app.put('/branches/:id', updateBranch);
app.delete('/branches/:id', deleteBranch);

describe('Branch Controller', () => {
  const mockBranch = {
    branch_id: '1',
    city: 'תל אביב',
    address: 'רחוב 1',
    manager_name: 'דני',
    phone_number: '0501234567',
    additional_phone: '0507654321',
    status: 'active'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBranch', () => {
    it('should create branch successfully', async () => {
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitize as jest.Mock).mockReturnValue(mockBranch);
      (db.Branch.createBranch as jest.Mock).mockResolvedValue(mockBranch);

      const res = await request(app).post('/branches').send(mockBranch);
      expect(res.status).toBe(201);
      expect(res.body.city).toBe('תל אביב');
    });

    it('should handle validation error', async () => {
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw { status: 400, message: 'No body provided' };
      });

      const res = await request(app).post('/branches').send({});
      expect(res.status).toBe(400);
    });

    it('should handle general error', async () => {
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitize as jest.Mock).mockImplementation(() => { throw new Error('fail'); });

      const res = await request(app).post('/branches').send(mockBranch);
      expect(res.status).toBe(500);
    });
  });

  describe('getBranches', () => {
    it('should return all branches', async () => {
      (db.Branch.getBranches as jest.Mock).mockResolvedValue([mockBranch]);
      const res = await request(app).get('/branches');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle DB error', async () => {
      (db.Branch.getBranches as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await request(app).get('/branches');
      expect(res.status).toBe(500);
    });
  });

  describe('getBranchById', () => {
    it('should return branch by id', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
      (db.Branch.getBranchById as jest.Mock).mockResolvedValue(mockBranch);

      const res = await request(app).get('/branches/1');
      expect(res.status).toBe(200);
      expect(res.body.branch_id).toBe('1');
    });

    it('should return 404 if branch does not exist', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

      const res = await request(app).get('/branches/1');
      expect(res.status).toBe(404);
    });

    it('should handle general error', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => { throw new Error('fail'); });

      const res = await request(app).get('/branches/1');
      expect(res.status).toBe(500);
    });
  });

  describe('getBranchesByCity', () => {
    it('should return branches by city', async () => {
      (db.Branch.getBranchesByCity as jest.Mock).mockResolvedValue([mockBranch]);
      const res = await request(app).get('/branches/city/תל אביב');
      expect(res.status).toBe(200);
      expect(res.body[0].city).toBe('תל אביב');
    });

    it('should return 404 if no branches found', async () => {
      (db.Branch.getBranchesByCity as jest.Mock).mockResolvedValue([]);
      const res = await request(app).get('/branches/city/חיפה');
      expect(res.status).toBe(404);
    });

    it('should handle general error', async () => {
      (db.Branch.getBranchesByCity as jest.Mock).mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/branches/city/תל אביב');
      expect(res.status).toBe(500);
    });
  });

  describe('updateBranch', () => {
    it('should update branch successfully', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitize as jest.Mock).mockReturnValue(mockBranch);
      (db.Branch.updateBranch as jest.Mock).mockResolvedValue({ ...mockBranch, city: 'חיפה' });

      const res = await request(app).put('/branches/1').send(mockBranch);
      expect(res.status).toBe(200);
      expect(res.body.city).toBe('חיפה');
    });

    it('should return 404 if branch not found', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitize as jest.Mock).mockReturnValue(mockBranch);
      (db.Branch.updateBranch as jest.Mock).mockImplementation(() => {
        throw { status: 404, message: 'branch not found' };
      });

      const res = await request(app).put('/branches/1').send(mockBranch);
      expect(res.status).toBe(404);
    });

    it('should handle general error', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (Branch.sanitize as jest.Mock).mockReturnValue(mockBranch);
      (db.Branch.updateBranch as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app).put('/branches/1').send(mockBranch);
      expect(res.status).toBe(500);
    });
  });

  describe('deleteBranch', () => {
    it('should delete branch successfully', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
      (db.Branch.deleteBranch as jest.Mock).mockResolvedValue({ ...mockBranch, status: 'inactive' });

      const res = await request(app).delete('/branches/1');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('inactive');
    });

    it('should return 404 if branch not found', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

      const res = await request(app).delete('/branches/1');
      expect(res.status).toBe(404);
    });

    it('should handle general error', async () => {
      (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => { throw new Error('fail'); });

      const res = await request(app).delete('/branches/1');
      expect(res.status).toBe(500);
    });
  });
});