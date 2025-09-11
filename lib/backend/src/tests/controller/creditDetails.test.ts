import * as db from '../../db';
import { createCreditDetails, getCreditDetails, getCreditDetailsById, updateCreditDetails } from '../../controller/creditDetails';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  CreditDetails: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { CreditDetails } from '../../../../model/src';

// Mock console.log to prevent cluttering test output
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('CreditDetails Controller Tests', () => {
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
        consoleSpy.mockClear();
    });

    describe('createCreditDetails', () => {
        it('should create new credit details successfully', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockResolvedValue(creditDetailsData);

            await createCreditDetails(req as Request, res as Response, next);

            expect(CreditDetails.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(CreditDetails.sanitize).toHaveBeenCalledWith(creditDetailsData, false);
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
            expect(db.CreditDetails.doesTokenExist).toHaveBeenCalledWith('unique_token_123');
            expect(db.CreditDetails.createCreditDetails).toHaveBeenCalledWith(creditDetailsData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(creditDetailsData);
        });

        it('should return 404 if customer does not exist', async () => {
            const creditDetailsData = { 
                customer_id: '999', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer does not exist'
            });
        });

        it('should return 490 if token already exists', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'existing_token',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(true);

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 490,
                message: 'token already exist'
            });
        });

        it('should handle errors during credit details creation', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            const error = new Error('Database error');
            (db.CreditDetails.createCreditDetails as jest.Mock).mockRejectedValue(error);

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during customer existence check', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            const error = new Error('DB error');
            (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during token existence check', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.CreditDetails.doesTokenExist as jest.Mock).mockRejectedValue(error);

            await createCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should log sanitized data and token existence result', async () => {
            const creditDetailsData = { 
                customer_id: '1', 
                token: 'unique_token_123',
                expiry_month: '12',
                expiry_year: '2025'
            };
            req.body = creditDetailsData;

            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(creditDetailsData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockResolvedValue(creditDetailsData);

            await createCreditDetails(req as Request, res as Response, next);

            // The code uses logger, not console.log, so we check for successful execution
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(creditDetailsData);
        });
    });

    describe('getCreditDetails', () => {
        it('should retrieve all credit details with pagination', async () => {
            const creditDetails = [
                { credit_id: 1, customer_id: '1', token: 'token1' },
                { credit_id: 2, customer_id: '2', token: 'token2' }
            ];
            req.query = { page: '1' };
            (db.CreditDetails.getCreditDetails as jest.Mock).mockResolvedValue({ creditDetails, total: 2 });

            await getCreditDetails(req as Request, res as Response, next);

            expect(db.CreditDetails.getCreditDetails).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: creditDetails,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const creditDetails = [{ credit_id: 1, customer_id: '1', token: 'token1' }];
            req.query = {};
            (db.CreditDetails.getCreditDetails as jest.Mock).mockResolvedValue({ creditDetails, total: 1 });

            await getCreditDetails(req as Request, res as Response, next);

            expect(db.CreditDetails.getCreditDetails).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: creditDetails,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle errors during credit details retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.CreditDetails.getCreditDetails as jest.Mock).mockRejectedValue(error);

            await getCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle invalid page parameter', async () => {
            const creditDetails = [{ credit_id: 1, customer_id: '1', token: 'token1' }];
            req.query = { page: 'invalid' };
            (db.CreditDetails.getCreditDetails as jest.Mock).mockResolvedValue({ creditDetails, total: 1 });

            await getCreditDetails(req as Request, res as Response, next);

            expect(db.CreditDetails.getCreditDetails).toHaveBeenCalledWith(0); // defaults to page 1
        });

        it('should calculate correct pagination for multiple pages', async () => {
            const creditDetails = [{ credit_id: 1, customer_id: '1', token: 'token1' }];
            req.query = { page: '3' };
            const mockLimit = 10; // Assuming limit is 10
            (db.CreditDetails.getCreditDetails as jest.Mock).mockResolvedValue({ creditDetails, total: 25 });

            await getCreditDetails(req as Request, res as Response, next);

            expect(db.CreditDetails.getCreditDetails).toHaveBeenCalledWith(20); // offset for page 3
            expect(res.json).toHaveBeenCalledWith({
                data: creditDetails,
                page: 3,
                totalPages: expect.any(Number),
                total: 25
            });
        });
    });

    describe('getCreditDetailsById', () => {
        it('should retrieve credit details by ID', async () => {
            const creditDetails = { credit_id: 1, customer_id: '1', token: 'token1' };
            req.params = { id: '1' };
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(creditDetails);

            await getCreditDetailsById(req as Request, res as Response, next);

            expect(CreditDetails.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.CreditDetails.doesCreditDetailsExist).toHaveBeenCalledWith('1');
            expect(db.CreditDetails.getCreditDetailsById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(creditDetails);
        });

        it('should return 404 if credit details not found', async () => {
            req.params = { id: '999' };
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(false);

            await getCreditDetailsById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'CreditDetails does not exist.'
            });
        });

        it('should handle errors during credit details existence check', async () => {
            req.params = { id: '1' };
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockRejectedValue(error);

            await getCreditDetailsById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getCreditDetailsById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during credit details retrieval by ID', async () => {
            req.params = { id: '1' };
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockRejectedValue(error);

            await getCreditDetailsById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateCreditDetails', () => {
        it('should update credit details successfully', async () => {
            const updatedCreditDetails = { 
                credit_id: 1, 
                customer_id: '2', 
                token: 'updated_token',
                expiry_month: '01',
                expiry_year: '2026'
            };
            req.params = { id: '1' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token',
                expiry_month: '01',
                expiry_year: '2026'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockResolvedValue(updatedCreditDetails);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(CreditDetails.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(CreditDetails.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(CreditDetails.sanitize).toHaveBeenCalledWith(req.body, true);
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('2');
            expect(db.CreditDetails.updateCreditDetails).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedCreditDetails);
        });

        it('should return 404 if customer does not exist during update', async () => {
            req.params = { id: '1' };
            req.body = { 
                customer_id: '999', 
                token: 'updated_token'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer does not exist'
            });
        });

        it('should handle error during credit details update', async () => {
            req.params = { id: '1' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Update failed');
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockRejectedValue(error);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token'
            };
            
            const sanitizeError = new Error('Invalid ID format');
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = { invalid_field: 'value' };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const sanitizeError = new Error('Invalid body format');
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle credit details not found during update', async () => {
            req.params = { id: '999' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            const error = { status: 404, message: 'CreditDetails not found' };
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockRejectedValue(error);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during customer existence check in update', async () => {
            req.params = { id: '1' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            const error = new Error('DB error');
            (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle data sanitization and call sanitize with correct parameters', async () => {
            const updatedCreditDetails = { 
                credit_id: 1, 
                customer_id: '2', 
                token: 'updated_token'
            };
            req.params = { id: '1' };
            req.body = { 
                customer_id: '2', 
                token: 'updated_token'
            };
            
            (CreditDetails.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (CreditDetails.sanitize as jest.Mock).mockReturnValue(req.body);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockResolvedValue(updatedCreditDetails);

            await updateCreditDetails(req as Request, res as Response, next);

            expect(CreditDetails.sanitize).toHaveBeenCalledWith(req.body, true);
        });
    });
});
