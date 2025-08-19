import * as db from '../../db';
import { createBranch, getBranches, getBranchById, getBranchesByCity, updateBranch, deleteBranch } from '../../controller/branch';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  Branch: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { Branch } from '../../../../model/src';

describe('Branch Controller Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createBranch', () => {
        it('should create a new branch successfully', async () => {
            const branchData = { 
                city: 'Tel Aviv', 
                address: 'Dizengoff 1', 
                manager_name: 'John Doe',
                phone_number: '03-1234567',
                additional_phone: '054-9876543'
            };
            req.body = branchData;

            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (Branch.sanitize as jest.Mock).mockReturnValue(branchData);
            (db.Branch.createBranch as jest.Mock).mockResolvedValue(branchData);

            await createBranch(req as Request, res as Response, next);

            expect(Branch.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(Branch.sanitize).toHaveBeenCalledWith(branchData, false);
            expect(db.Branch.createBranch).toHaveBeenCalledWith(branchData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(branchData);
        });

        it('should handle errors during branch creation', async () => {
            const branchData = { 
                city: 'Tel Aviv', 
                address: 'Dizengoff 1', 
                manager_name: 'John Doe'
            };
            req.body = branchData;

            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (Branch.sanitize as jest.Mock).mockReturnValue(branchData);
            const error = new Error('Database error');
            (db.Branch.createBranch as jest.Mock).mockRejectedValue(error);

            await createBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });
    });

    describe('getBranches', () => {
        it('should retrieve all branches with pagination', async () => {
            const branches = [
                { branch_id: 1, city: 'Tel Aviv', address: 'Dizengoff 1' },
                { branch_id: 2, city: 'Jerusalem', address: 'King George 5' }
            ];
            req.query = { page: '1' };
            (db.Branch.getBranches as jest.Mock).mockResolvedValue({ branches, total: 2 });

            await getBranches(req as Request, res as Response, next);

            expect(db.Branch.getBranches).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branches,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const branches = [{ branch_id: 1, city: 'Tel Aviv' }];
            req.query = {};
            (db.Branch.getBranches as jest.Mock).mockResolvedValue({ branches, total: 1 });

            await getBranches(req as Request, res as Response, next);

            expect(db.Branch.getBranches).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: branches,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle errors during branch retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.Branch.getBranches as jest.Mock).mockRejectedValue(error);

            await getBranches(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle invalid page parameter', async () => {
            const branches = [{ branch_id: 1, city: 'Tel Aviv' }];
            req.query = { page: 'invalid' };
            (db.Branch.getBranches as jest.Mock).mockResolvedValue({ branches, total: 1 });

            await getBranches(req as Request, res as Response, next);

            expect(db.Branch.getBranches).toHaveBeenCalledWith(0); // defaults to page 1
        });
    });

    describe('getBranchById', () => {
        it('should retrieve a branch by ID', async () => {
            const branch = { branch_id: 1, city: 'Tel Aviv', address: 'Dizengoff 1' };
            req.params = { id: '1' };
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Branch.getBranchById as jest.Mock).mockResolvedValue(branch);

            await getBranchById(req as Request, res as Response, next);

            expect(Branch.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.Branch.getBranchById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(branch);
        });

        it('should return 404 if branch not found', async () => {
            req.params = { id: '999' };
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await getBranchById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should handle errors during branch existence check', async () => {
            req.params = { id: '1' };
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await getBranchById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during branch retrieval by ID', async () => {
            req.params = { id: '1' };
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.Branch.getBranchById as jest.Mock).mockRejectedValue(error);

            await getBranchById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBranchesByCity', () => {
        it('should retrieve branches by city', async () => {
            req.params = { city: 'Tel Aviv' };
            req.query = { page: '1' };
            const branches = [{ branch_id: 1, city: 'Tel Aviv', address: 'Dizengoff 1' }];
            (db.Branch.getBranchesByCity as jest.Mock).mockResolvedValue({ branches, total: 1 });

            await getBranchesByCity(req as Request, res as Response, next);

            expect(db.Branch.getBranchesByCity).toHaveBeenCalledWith('Tel Aviv', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branches,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle missing city parameter', async () => {
            req.params = {};

            await getBranchesByCity(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 400,
                message: 'Invalid city.'
            });
        });

        it('should handle empty city parameter', async () => {
            req.params = { city: '' };

            await getBranchesByCity(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 400,
                message: 'Invalid city.'
            });
        });

        it('should return 404 if no branches found in city', async () => {
            req.params = { city: 'NonExistentCity' };
            req.query = { page: '1' };
            (db.Branch.getBranchesByCity as jest.Mock).mockResolvedValue({ branches: [], total: 0 });

            await getBranchesByCity(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'No branches found in the city: NonExistentCity'
            });
        });

        it('should handle errors during getBranchesByCity', async () => {
            req.params = { city: 'Tel Aviv' };
            req.query = { page: '1' };
            const error = new Error('DB error');
            (db.Branch.getBranchesByCity as jest.Mock).mockRejectedValue(error);

            await getBranchesByCity(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { city: 'Tel Aviv' };
            req.query = {};
            const branches = [{ branch_id: 1, city: 'Tel Aviv' }];
            (db.Branch.getBranchesByCity as jest.Mock).mockResolvedValue({ branches, total: 1 });

            await getBranchesByCity(req as Request, res as Response, next);

            expect(db.Branch.getBranchesByCity).toHaveBeenCalledWith('Tel Aviv', 0);
        });
    });

    describe('updateBranch', () => {
        it('should update a branch successfully', async () => {
            const updatedBranch = { 
                branch_id: 1, 
                city: 'Tel Aviv', 
                address: 'New Address 123' 
            };
            req.params = { id: '1' };
            req.body = { address: 'New Address 123' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.updateBranch as jest.Mock).mockResolvedValue(updatedBranch);

            await updateBranch(req as Request, res as Response, next);

            expect(Branch.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(Branch.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(Branch.sanitize).toHaveBeenCalledWith(req.body, true);
            expect(db.Branch.updateBranch).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBranch);
        });

        it('should handle error during branch update', async () => {
            req.params = { id: '1' };
            req.body = { address: 'New Address' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitize as jest.Mock).mockReturnValue(req.body);
            const error = new Error('Update failed');
            (db.Branch.updateBranch as jest.Mock).mockRejectedValue(error);

            await updateBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = { address: 'New Address' };
            
            const sanitizeError = new Error('Invalid ID format');
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = { invalid_field: 'value' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const sanitizeError = new Error('Invalid body format');
            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch not found during update', async () => {
            req.params = { id: '999' };
            req.body = { address: 'New Address' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Branch.sanitize as jest.Mock).mockReturnValue(req.body);
            const error = { status: 404, message: 'branch not found' };
            (db.Branch.updateBranch as jest.Mock).mockRejectedValue(error);

            await updateBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteBranch', () => {
        it('should delete a branch successfully', async () => {
            const deletedBranch = { 
                branch_id: 1, 
                city: 'Tel Aviv', 
                status: 'inactive' 
            };
            req.params = { id: '1' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Branch.deleteBranch as jest.Mock).mockResolvedValue(deletedBranch);

            await deleteBranch(req as Request, res as Response, next);

            expect(Branch.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.Branch.deleteBranch).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedBranch);
        });

        it('should return 404 if branch does not exist', async () => {
            req.params = { id: '999' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await deleteBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should handle errors during branch existence check', async () => {
            req.params = { id: '1' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await deleteBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during deleteBranch', async () => {
            req.params = { id: '1' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Delete failed');
            (db.Branch.deleteBranch as jest.Mock).mockRejectedValue(error);

            await deleteBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: 'invalid' };
            
            const sanitizeError = new Error('Invalid ID format');
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await deleteBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch not found during deletion', async () => {
            req.params = { id: '1' };
            
            (Branch.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'Branch not found' };
            (db.Branch.deleteBranch as jest.Mock).mockRejectedValue(error);

            await deleteBranch(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
