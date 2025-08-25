import * as db from '../../db';
import { createMonthlyPayment, updateMonthlyPayment } from '../../controller/MonthlyPaymentManagement';
import { Request, Response, NextFunction } from "express";
import getDbConnection from '../../db/connection';
import { updateItems } from '../../controller/item';

jest.mock("../../db");
jest.mock('../../db/connection');
jest.mock('../../controller/item');
jest.mock('../../../../model/src', () => ({
  MonthlyPaymentManagement: {
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
    sanitizeBodyExisting: jest.fn(),
  }
}))

import { MonthlyPaymentManagement } from '../../../../model/src';

describe('MonthlyPaymentManagement Controller Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockTrx: any;
    let mockKnex: any;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        
        mockTrx = {
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
        };
        
        mockKnex = {
            transaction: jest.fn().mockResolvedValue(mockTrx),
        };
        
        (getDbConnection as jest.Mock).mockReturnValue(mockKnex);
        
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createMonthlyPayment', () => {
        it('should create a monthly payment successfully', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000, status: 'active' },
                creditDetails: { token: 'token123', credit_id: 1 },
                paymentCreditLink: {},
                payments: [{ amount: 500 }],
                items: [{ name: 'Item 1', price: 100 }]
            };
            
            req.body = monthlyPaymentData;

            const sanitized = {
                customer_id: 1,
                monthlyPayment: { amount: 1000, status: 'active' },
                creditDetails: { token: 'token123', credit_id: 1 },
                paymentCreditLink: {},
                payments: [{ amount: 500 }],
                items: [{ name: 'Item 1', price: 100 }]
            };

            const createdMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const createdCreditDetails = { credit_id: 1, token: 'token123' };

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(createdMonthlyPayment);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockResolvedValue(createdCreditDetails);
            (db.PaymentCreditLink.createPaymentCreditLink as jest.Mock).mockResolvedValue({});
            (db.Payments.createPayments as jest.Mock).mockResolvedValue({});
            (db.Item.createItem as jest.Mock).mockResolvedValue({});

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(MonthlyPaymentManagement.sanitize).toHaveBeenCalledWith(req.body);
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith(1);
            expect(db.MonthlyPayment.createMonthlyPayment).toHaveBeenCalledWith(sanitized.monthlyPayment, mockTrx);
            expect(db.CreditDetails.doesTokenExist).toHaveBeenCalledWith('token123');
            expect(db.CreditDetails.createCreditDetails).toHaveBeenCalledWith(sanitized.creditDetails, mockTrx);
            expect(db.PaymentCreditLink.createPaymentCreditLink).toHaveBeenCalled();
            expect(db.Payments.createPayments).toHaveBeenCalled();
            expect(db.Item.createItem).toHaveBeenCalled();
            expect(mockTrx.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdMonthlyPayment);
        });

        it('should return 404 if customer does not exist', async () => {
            const monthlyPaymentData = {
                customer_id: 999,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'token123' },
                paymentCreditLink: {},
                payments: [],
                items: []
            };
            
            req.body = monthlyPaymentData;

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'customer dose not exist'
            });
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should return 409 if token already exists', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'existing_token' },
                paymentCreditLink: {},
                payments: [],
                items: []
            };
            
            req.body = monthlyPaymentData;
            const createdMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(createdMonthlyPayment);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(true);

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'token already exist'
            });
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle database errors during monthly payment creation', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'token123' },
                paymentCreditLink: {},
                payments: [],
                items: []
            };
            
            req.body = monthlyPaymentData;
            const dbError = new Error('Database error');

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockRejectedValue(dbError);

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle database errors during credit details creation', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'token123' },
                paymentCreditLink: {},
                payments: [],
                items: []
            };
            
            req.body = monthlyPaymentData;
            const createdMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const dbError = new Error('Database error');

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(createdMonthlyPayment);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockRejectedValue(dbError);

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle payments array with null values', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'token123', credit_id: 1 },
                paymentCreditLink: {},
                payments: [{ amount: 500 }, null, { amount: 300 }],
                items: []
            };
            
            req.body = monthlyPaymentData;
            const createdMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const createdCreditDetails = { credit_id: 1, token: 'token123' };

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(createdMonthlyPayment);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockResolvedValue(createdCreditDetails);
            (db.PaymentCreditLink.createPaymentCreditLink as jest.Mock).mockResolvedValue({});
            (db.Payments.createPayments as jest.Mock).mockResolvedValue({});

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(db.Payments.createPayments).toHaveBeenCalledTimes(2); // Only for non-null payments
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should handle items array with null values', async () => {
            const monthlyPaymentData = {
                customer_id: 1,
                monthlyPayment: { amount: 1000 },
                creditDetails: { token: 'token123', credit_id: 1 },
                paymentCreditLink: {},
                payments: [],
                items: [{ name: 'Item 1' }, null, { name: 'Item 2' }]
            };
            
            req.body = monthlyPaymentData;
            const createdMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const createdCreditDetails = { credit_id: 1, token: 'token123' };

            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(createdMonthlyPayment);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.createCreditDetails as jest.Mock).mockResolvedValue(createdCreditDetails);
            (db.PaymentCreditLink.createPaymentCreditLink as jest.Mock).mockResolvedValue({});
            (db.Item.createItem as jest.Mock).mockResolvedValue({});

            await createMonthlyPayment(req as Request, res as Response, next);

            expect(db.Item.createItem).toHaveBeenCalledTimes(2); // Only for non-null items
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateMonthlyPayment', () => {
        it('should update a monthly payment successfully', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500, status: 'active' },
                creditDetails: { credit_id: 1, token: 'new_token' },
                items: [{ name: 'Updated Item', price: 200 }]
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const existingCreditDetails = { credit_id: 1, token: 'old_token' };
            const existingItems = [{ item_id: 1, name: 'Old Item' }];

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue({});
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(existingCreditDetails);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockResolvedValue({});
            (db.Item.getAllItemsByMonthlyPaymentIdNoPagination as jest.Mock).mockResolvedValue(existingItems);
            (updateItems as jest.Mock).mockResolvedValue({});

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(MonthlyPaymentManagement.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(MonthlyPaymentManagement.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith(1);
            expect(db.MonthlyPayment.getMonthlyPaymentById).toHaveBeenCalledWith('1');
            expect(db.MonthlyPayment.updateMonthlyPayment).toHaveBeenCalledWith('1', updateData.monthlyPayment, mockTrx);
            expect(db.CreditDetails.updateCreditDetails).toHaveBeenCalledWith(1, updateData.creditDetails, mockTrx);
            expect(updateItems).toHaveBeenCalledWith(existingItems, updateData.items, mockTrx);
            expect(mockTrx.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Monthly payment updated successfully!' });
        });

        it('should return 404 if customer does not exist', async () => {
            const updateData = {
                customer_id: 999,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'token' },
                items: []
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'Customer does not exist'
            });
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should return 404 if monthly payment does not exist', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'token' },
                items: []
            };
            
            req.params = { id: '999' };
            req.body = updateData;

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(null);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'Monthly Payment does not exist'
            });
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should return 409 if token already exists and is different from current', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'existing_token' },
                items: []
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const existingCreditDetails = { credit_id: 1, token: 'old_token' };

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue({});
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(existingCreditDetails);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(true);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'Token already exists'
            });
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should allow token update if token is the same as current', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'same_token' },
                items: []
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const existingCreditDetails = { credit_id: 1, token: 'same_token' };
            const existingItems: any[] = [];

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue({});
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(existingCreditDetails);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockResolvedValue({});
            (db.Item.getAllItemsByMonthlyPaymentIdNoPagination as jest.Mock).mockResolvedValue(existingItems);
            (updateItems as jest.Mock).mockResolvedValue({});

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(db.CreditDetails.updateCreditDetails).toHaveBeenCalled();
            expect(mockTrx.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = {};
            
            const sanitizeError = new Error('Invalid ID format');
            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = {};
            
            const sanitizeError = new Error('Body sanitization failed');
            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle database errors during monthly payment update', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'token' },
                items: []
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const dbError = new Error('Database error');

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockRejectedValue(dbError);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle errors during credit details update', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'new_token' },
                items: []
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const existingCreditDetails = { credit_id: 1, token: 'old_token' };
            const dbError = new Error('Credit update failed');

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue({});
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(existingCreditDetails);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockRejectedValue(dbError);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });

        it('should handle errors during items update', async () => {
            const updateData = {
                customer_id: 1,
                monthlyPayment: { amount: 1500 },
                creditDetails: { credit_id: 1, token: 'new_token' },
                items: [{ name: 'Updated Item' }]
            };
            
            req.params = { id: '1' };
            req.body = updateData;

            const existingMonthlyPayment = { monthlyPayment_id: 1, amount: 1000 };
            const existingCreditDetails = { credit_id: 1, token: 'old_token' };
            const existingItems = [{ item_id: 1, name: 'Old Item' }];
            const itemsError = new Error('Items update failed');

            (MonthlyPaymentManagement.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (MonthlyPaymentManagement.sanitize as jest.Mock).mockReturnValue(updateData);
            (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
            (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(existingMonthlyPayment);
            (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue({});
            (db.CreditDetails.getCreditDetailsById as jest.Mock).mockResolvedValue(existingCreditDetails);
            (db.CreditDetails.doesTokenExist as jest.Mock).mockResolvedValue(false);
            (db.CreditDetails.updateCreditDetails as jest.Mock).mockResolvedValue({});
            (db.Item.getAllItemsByMonthlyPaymentIdNoPagination as jest.Mock).mockResolvedValue(existingItems);
            (updateItems as jest.Mock).mockRejectedValue(itemsError);

            await updateMonthlyPayment(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(itemsError);
            expect(mockTrx.rollback).toHaveBeenCalled();
        });
    });
});
