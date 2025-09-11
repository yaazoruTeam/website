import * as db from '../../db';
import { createBranchUser, getAllBranchUser, getBranchUserById, getBranchUserByBranch_id, getBranchUserByUser_id, updateBranchUser, deleteBranchUser } from '../../controller/branchUser';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  BranchUser: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { BranchUser } from '../../../../model/src';

describe('BranchUser Controller Tests', () => {
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

    describe('createBranchUser', () => {
        it('should create a new branch user successfully', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.doesBranchUserCombinationExist as jest.Mock).mockResolvedValue(false);
            (db.BranchUser.createBranchUser as jest.Mock).mockResolvedValue(branchUserData);

            await createBranchUser(req as Request, res as Response, next);

            expect(BranchUser.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(BranchUser.sanitize).toHaveBeenCalledWith(branchUserData, false);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.User.doesUserExist).toHaveBeenCalledWith('2');
            expect(db.BranchUser.doesBranchUserCombinationExist).toHaveBeenCalledWith('1', '2');
            expect(db.BranchUser.createBranchUser).toHaveBeenCalledWith(branchUserData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(branchUserData);
        });

        it('should return 404 if branch does not exist', async () => {
            const branchUserData = { 
                branch_id: '999', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should return 404 if user does not exist', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '999'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(false);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'user does not exist.'
            });
        });

        it('should return 409 if branch user combination already exists', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.doesBranchUserCombinationExist as jest.Mock).mockResolvedValue(true);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'branchUser combination already exists.'
            });
        });

        it('should handle errors during branch user creation', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.doesBranchUserCombinationExist as jest.Mock).mockResolvedValue(false);
            const error = new Error('Database error');
            (db.BranchUser.createBranchUser as jest.Mock).mockRejectedValue(error);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during branch existence check', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during user existence check', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.User.doesUserExist as jest.Mock).mockRejectedValue(error);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during combination existence check', async () => {
            const branchUserData = { 
                branch_id: '1', 
                user_id: '2'
            };
            req.body = branchUserData;

            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchUser.sanitize as jest.Mock).mockReturnValue(branchUserData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchUser.doesBranchUserCombinationExist as jest.Mock).mockRejectedValue(error);

            await createBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllBranchUser', () => {
        it('should retrieve all branch users with pagination', async () => {
            const branchUsers = [
                { branchUser_id: 1, branch_id: '1', user_id: '2' },
                { branchUser_id: 2, branch_id: '2', user_id: '3' }
            ];
            req.query = { page: '1' };
            (db.BranchUser.getAllBranchUser as jest.Mock).mockResolvedValue({ branchUsers, total: 2 });

            await getAllBranchUser(req as Request, res as Response, next);

            expect(db.BranchUser.getAllBranchUser).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchUsers,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            req.query = {};
            (db.BranchUser.getAllBranchUser as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getAllBranchUser(req as Request, res as Response, next);

            expect(db.BranchUser.getAllBranchUser).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: branchUsers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle errors during branch user retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.BranchUser.getAllBranchUser as jest.Mock).mockRejectedValue(error);

            await getAllBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle invalid page parameter', async () => {
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            req.query = { page: 'invalid' };
            (db.BranchUser.getAllBranchUser as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getAllBranchUser(req as Request, res as Response, next);

            expect(db.BranchUser.getAllBranchUser).toHaveBeenCalledWith(0); // defaults to page 1
        });
    });

    describe('getBranchUserById', () => {
        it('should retrieve a branch user by ID', async () => {
            const branchUser = { branchUser_id: 1, branch_id: '1', user_id: '2' };
            req.params = { id: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.getBranchUserById as jest.Mock).mockResolvedValue(branchUser);

            await getBranchUserById(req as Request, res as Response, next);

            expect(BranchUser.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchUser.doesBranchUserExist).toHaveBeenCalledWith('1');
            expect(db.BranchUser.getBranchUserById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(branchUser);
        });

        it('should return 404 if branch user not found', async () => {
            req.params = { id: '999' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(false);

            await getBranchUserById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branchUser does not exist.'
            });
        });

        it('should handle errors during branch user existence check', async () => {
            req.params = { id: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockRejectedValue(error);

            await getBranchUserById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchUserById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during branch user retrieval by ID', async () => {
            req.params = { id: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchUser.getBranchUserById as jest.Mock).mockRejectedValue(error);

            await getBranchUserById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBranchUserByBranch_id', () => {
        it('should retrieve branch users by branch ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.getBranchUserByBranch_id as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(BranchUser.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchUser.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.BranchUser.getBranchUserByBranch_id).toHaveBeenCalledWith('1', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchUsers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if branch does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '1' };
            req.query = {};
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.getBranchUserByBranch_id as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(db.BranchUser.getBranchUserByBranch_id).toHaveBeenCalledWith('1', 0);
        });

        it('should handle errors during branch existence check', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchUser.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during getBranchUserByBranch_id', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchUser.getBranchUserByBranch_id as jest.Mock).mockRejectedValue(error);

            await getBranchUserByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBranchUserByUser_id', () => {
        it('should retrieve branch users by user ID', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.getBranchUserByUser_id as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(BranchUser.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchUser.doesUserExist).toHaveBeenCalledWith('2');
            expect(db.BranchUser.getBranchUserByUser_id).toHaveBeenCalledWith('2', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchUsers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if user does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesUserExist as jest.Mock).mockResolvedValue(false);

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'user does not exist.'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '2' };
            req.query = {};
            const branchUsers = [{ branchUser_id: 1, branch_id: '1', user_id: '2' }];
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.getBranchUserByUser_id as jest.Mock).mockResolvedValue({ branchUsers, total: 1 });

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(db.BranchUser.getBranchUserByUser_id).toHaveBeenCalledWith('2', 0);
        });

        it('should handle errors during user existence check', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchUser.doesUserExist as jest.Mock).mockRejectedValue(error);

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during getBranchUserByUser_id', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesUserExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchUser.getBranchUserByUser_id as jest.Mock).mockRejectedValue(error);

            await getBranchUserByUser_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateBranchUser', () => {
        it('should update a branch user successfully', async () => {
            const updatedBranchUser = { 
                branchUser_id: 1, 
                branch_id: '2', 
                user_id: '3'
            };
            req.params = { id: '1' };
            req.body = { branch_id: '2', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.updateBranchUser as jest.Mock).mockResolvedValue(updatedBranchUser);

            await updateBranchUser(req as Request, res as Response, next);

            expect(BranchUser.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(BranchUser.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(BranchUser.sanitize).toHaveBeenCalledWith(req.body, true);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('2');
            expect(db.User.doesUserExist).toHaveBeenCalledWith('3');
            expect(db.BranchUser.updateBranchUser).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBranchUser);
        });

        it('should return 404 if branch does not exist during update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '999', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should return 404 if user does not exist during update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', user_id: '999' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(false);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'user does not exist.'
            });
        });

        it('should handle error during branch user update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Update failed');
            (db.BranchUser.updateBranchUser as jest.Mock).mockRejectedValue(error);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = { branch_id: '2', user_id: '3' };
            
            const sanitizeError = new Error('Invalid ID format');
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = { invalid_field: 'value' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const sanitizeError = new Error('Invalid body format');
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch user not found during update', async () => {
            req.params = { id: '999' };
            req.body = { branch_id: '2', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.User.doesUserExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'branchUser not found' };
            (db.BranchUser.updateBranchUser as jest.Mock).mockRejectedValue(error);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during branch existence check in update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during user existence check in update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', user_id: '3' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchUser.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.User.doesUserExist as jest.Mock).mockRejectedValue(error);

            await updateBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteBranchUser', () => {
        it('should delete a branch user successfully', async () => {
            const deletedBranchUser = { 
                branchUser_id: 1, 
                branch_id: '1', 
                user_id: '2'
            };
            req.params = { id: '1' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(true);
            (db.BranchUser.deleteBranchUser as jest.Mock).mockResolvedValue(deletedBranchUser);

            await deleteBranchUser(req as Request, res as Response, next);

            expect(BranchUser.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchUser.doesBranchUserExist).toHaveBeenCalledWith('1');
            expect(db.BranchUser.deleteBranchUser).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedBranchUser);
        });

        it('should return 404 if branch user does not exist', async () => {
            req.params = { id: '999' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(false);

            await deleteBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branchUser does not exist.'
            });
        });

        it('should handle errors during branch user existence check', async () => {
            req.params = { id: '1' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockRejectedValue(error);

            await deleteBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during deleteBranchUser', async () => {
            req.params = { id: '1' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Delete failed');
            (db.BranchUser.deleteBranchUser as jest.Mock).mockRejectedValue(error);

            await deleteBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: 'invalid' };
            
            const sanitizeError = new Error('Invalid ID format');
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await deleteBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch user not found during deletion', async () => {
            req.params = { id: '1' };
            
            (BranchUser.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchUser.doesBranchUserExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'BranchUser not found' };
            (db.BranchUser.deleteBranchUser as jest.Mock).mockRejectedValue(error);

            await deleteBranchUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
