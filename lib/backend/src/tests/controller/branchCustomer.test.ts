import * as db from '../../db';
import { createBranchCustomer, getAllBranchCustomer, getBranchCustomerById, getBranchCustomerByBranch_id, getBranchCustomerByCustomer_id, updateBranchCustomer, deleteBranchCustomer } from '../../controller/branchCustomer';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  BranchCustomer: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { BranchCustomer } from '../../../../model/src';

describe('BranchCustomer Controller Tests', () => {
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

    describe('createBranchCustomer', () => {
        it('should create a new branch customer successfully', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.doesBranchCustomerCombinationExist as jest.Mock).mockResolvedValue(false);
            (db.BranchCustomer.createBranchCustomer as jest.Mock).mockResolvedValue(branchCustomerData);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(BranchCustomer.sanitize).toHaveBeenCalledWith(branchCustomerData, false);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('2');
            expect(db.BranchCustomer.doesBranchCustomerCombinationExist).toHaveBeenCalledWith('1', '2');
            expect(db.BranchCustomer.createBranchCustomer).toHaveBeenCalledWith(branchCustomerData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(branchCustomerData);
        });

        it('should return 404 if branch does not exist', async () => {
            const branchCustomerData = { 
                branch_id: '999', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should return 404 if customer does not exist', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '999'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer does not exist.'
            });
        });

        it('should return 409 if branch customer combination already exists', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.doesBranchCustomerCombinationExist as jest.Mock).mockResolvedValue(true);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'branchCustomer combination already exists.'
            });
        });

        it('should handle errors during branch customer creation', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.doesBranchCustomerCombinationExist as jest.Mock).mockResolvedValue(false);
            const error = new Error('Database error');
            (db.BranchCustomer.createBranchCustomer as jest.Mock).mockRejectedValue(error);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during branch existence check', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during customer existence check', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during combination existence check', async () => {
            const branchCustomerData = { 
                branch_id: '1', 
                customer_id: '2'
            };
            req.body = branchCustomerData;

            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(branchCustomerData);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchCustomer.doesBranchCustomerCombinationExist as jest.Mock).mockRejectedValue(error);

            await createBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllBranchCustomer', () => {
        it('should retrieve all branch customers with pagination', async () => {
            const branchCustomers = [
                { branchCustomer_id: 1, branch_id: '1', customer_id: '2' },
                { branchCustomer_id: 2, branch_id: '2', customer_id: '3' }
            ];
            req.query = { page: '1' };
            (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockResolvedValue({ branchCustomers, total: 2 });

            await getAllBranchCustomer(req as Request, res as Response, next);

            expect(db.BranchCustomer.getAllBranchCustomer).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchCustomers,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            req.query = {};
            (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getAllBranchCustomer(req as Request, res as Response, next);

            expect(db.BranchCustomer.getAllBranchCustomer).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: branchCustomers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle errors during branch customer retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockRejectedValue(error);

            await getAllBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle invalid page parameter', async () => {
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            req.query = { page: 'invalid' };
            (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getAllBranchCustomer(req as Request, res as Response, next);

            expect(db.BranchCustomer.getAllBranchCustomer).toHaveBeenCalledWith(0); // defaults to page 1
        });
    });

    describe('getBranchCustomerById', () => {
        it('should retrieve a branch customer by ID', async () => {
            const branchCustomer = { branchCustomer_id: 1, branch_id: '1', customer_id: '2' };
            req.params = { id: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.getBranchCustomerById as jest.Mock).mockResolvedValue(branchCustomer);

            await getBranchCustomerById(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchCustomer.doesBranchCustomerExist).toHaveBeenCalledWith('1');
            expect(db.BranchCustomer.getBranchCustomerById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(branchCustomer);
        });

        it('should return 404 if branch customer not found', async () => {
            req.params = { id: '999' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(false);

            await getBranchCustomerById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branchCustomer does not exist.'
            });
        });

        it('should handle errors during branch customer existence check', async () => {
            req.params = { id: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchCustomerById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during branch customer retrieval by ID', async () => {
            req.params = { id: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchCustomer.getBranchCustomerById as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBranchCustomerByBranch_id', () => {
        it('should retrieve branch customers by branch ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.getBranchCustomerByBranc_id as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchCustomer.doesBranchExist).toHaveBeenCalledWith('1');
            expect(db.BranchCustomer.getBranchCustomerByBranc_id).toHaveBeenCalledWith('1', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchCustomers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if branch does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '1' };
            req.query = {};
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.getBranchCustomerByBranc_id as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(db.BranchCustomer.getBranchCustomerByBranc_id).toHaveBeenCalledWith('1', 0);
        });

        it('should handle errors during branch existence check', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchCustomer.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during getBranchCustomerByBranch_id', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchCustomer.getBranchCustomerByBranc_id as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerByBranch_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBranchCustomerByCustomer_id', () => {
        it('should retrieve branch customers by customer ID', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.getBranchCustomerByCuseomer_id as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchCustomer.doesCustomerExist).toHaveBeenCalledWith('2');
            expect(db.BranchCustomer.getBranchCustomerByCuseomer_id).toHaveBeenCalledWith('2', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: branchCustomers,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if customer does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer does not exist.'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '2' };
            req.query = {};
            const branchCustomers = [{ branchCustomer_id: 1, branch_id: '1', customer_id: '2' }];
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.getBranchCustomerByCuseomer_id as jest.Mock).mockResolvedValue({ branchCustomers, total: 1 });

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(db.BranchCustomer.getBranchCustomerByCuseomer_id).toHaveBeenCalledWith('2', 0);
        });

        it('should handle errors during customer existence check', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchCustomer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during getBranchCustomerByCustomer_id', async () => {
            req.params = { id: '2' };
            req.query = { page: '1' };
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.BranchCustomer.getBranchCustomerByCuseomer_id as jest.Mock).mockRejectedValue(error);

            await getBranchCustomerByCustomer_id(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateBranchCustomer', () => {
        it('should update a branch customer successfully', async () => {
            const updatedBranchCustomer = { 
                branchCustomer_id: 1, 
                branch_id: '2', 
                customer_id: '3'
            };
            req.params = { id: '1' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockResolvedValue(updatedBranchCustomer);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(BranchCustomer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(BranchCustomer.sanitize).toHaveBeenCalledWith(req.body, true);
            expect(db.Branch.doesBranchExist).toHaveBeenCalledWith('2');
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('3');
            expect(db.BranchCustomer.updateBranchCustomer).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBranchCustomer);
        });

        it('should return 404 if branch does not exist during update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '999', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(false);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branch does not exist.'
            });
        });

        it('should return 404 if customer does not exist during update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', customer_id: '999' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer does not exist.'
            });
        });

        it('should handle error during branch customer update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Update failed');
            (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockRejectedValue(error);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            const sanitizeError = new Error('Invalid ID format');
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = { invalid_field: 'value' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const sanitizeError = new Error('Invalid body format');
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch customer not found during update', async () => {
            req.params = { id: '999' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'branchCustomer not found' };
            (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockRejectedValue(error);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during branch existence check in update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            const error = new Error('DB error');
            (db.Branch.doesBranchExist as jest.Mock).mockRejectedValue(error);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during customer existence check in update', async () => {
            req.params = { id: '1' };
            req.body = { branch_id: '2', customer_id: '3' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (BranchCustomer.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

            await updateBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteBranchCustomer', () => {
        it('should delete a branch customer successfully', async () => {
            const deletedBranchCustomer = { 
                branchCustomer_id: 1, 
                branch_id: '1', 
                customer_id: '2'
            };
            req.params = { id: '1' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.BranchCustomer.deleteBranchCustomer as jest.Mock).mockResolvedValue(deletedBranchCustomer);

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(BranchCustomer.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.BranchCustomer.doesBranchCustomerExist).toHaveBeenCalledWith('1');
            expect(db.BranchCustomer.deleteBranchCustomer).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedBranchCustomer);
        });

        it('should return 404 if branch customer does not exist', async () => {
            req.params = { id: '999' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(false);

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'branchCustomer does not exist.'
            });
        });

        it('should handle errors during branch customer existence check', async () => {
            req.params = { id: '1' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockRejectedValue(error);

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during deleteBranchCustomer', async () => {
            req.params = { id: '1' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Delete failed');
            (db.BranchCustomer.deleteBranchCustomer as jest.Mock).mockRejectedValue(error);

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: 'invalid' };
            
            const sanitizeError = new Error('Invalid ID format');
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle branch customer not found during deletion', async () => {
            req.params = { id: '1' };
            
            (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.BranchCustomer.doesBranchCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'BranchCustomer not found' };
            (db.BranchCustomer.deleteBranchCustomer as jest.Mock).mockRejectedValue(error);

            await deleteBranchCustomer(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
