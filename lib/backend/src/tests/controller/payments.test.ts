import * as db from '../../db';
import { 
    createPayments, 
    getAllPayments, 
    getPaymentsId, 
    getPaymentsByMonthlyPaymentId,
    updatePayments, 
    deletePayments 
} from '../../controller/payments';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  Payments: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { Payments } from '../../../../model/src';

describe('Payments Controller Tests', () => {
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

    describe('createPayments', () => {
        it('should create a payment successfully', async () => {
            const paymentsData = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };
            req.body = paymentsData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };

            const createdPayment = { payment_id: 1, ...sanitized };

            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.createPayments as jest.Mock).mockResolvedValue(createdPayment);

            await createPayments(req as Request, res as Response, next);

            expect(Payments.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(Payments.sanitize).toHaveBeenCalledWith(paymentsData, false);
            expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith(1);
            expect(db.Payments.createPayments).toHaveBeenCalledWith(sanitized);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdPayment);
        });

        it('should return 404 if monthly payment does not exist', async () => {
            const paymentsData = {
                monthlyPayment_id: 999,
                amount: 1000,
                payment_date: '2023-12-01'
            };
            req.body = paymentsData;

            const sanitized = {
                monthlyPayment_id: 999,
                amount: 1000,
                payment_date: '2023-12-01'
            };

            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

            await createPayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createPayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle database errors during payment creation', async () => {
            const paymentsData = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };
            req.body = paymentsData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };

            const dbError = new Error('Database error');
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.createPayments as jest.Mock).mockRejectedValue(dbError);

            await createPayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });

        it('should handle errors during monthly payment existence check', async () => {
            const paymentsData = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };
            req.body = paymentsData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1000,
                payment_date: '2023-12-01'
            };

            const dbError = new Error('Database error');
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(dbError);

            await createPayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });
    });

    describe('getAllPayments', () => {
        it('should retrieve all payments with pagination', async () => {
            const payments = [
                { payment_id: 1, amount: 1000, monthlyPayment_id: 1 },
                { payment_id: 2, amount: 1500, monthlyPayment_id: 2 }
            ];
            req.query = { page: '1' };
            (db.Payments.getPayments as jest.Mock).mockResolvedValue({ payments, total: 2 });

            await getAllPayments(req as Request, res as Response, next);

            expect(db.Payments.getPayments).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: payments,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const payments = [{ payment_id: 1, amount: 1000, monthlyPayment_id: 1 }];
            req.query = {};
            (db.Payments.getPayments as jest.Mock).mockResolvedValue({ payments, total: 1 });

            await getAllPayments(req as Request, res as Response, next);

            expect(db.Payments.getPayments).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: payments,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle invalid page parameter', async () => {
            const payments = [{ payment_id: 1, amount: 1000, monthlyPayment_id: 1 }];
            req.query = { page: 'invalid' };
            (db.Payments.getPayments as jest.Mock).mockResolvedValue({ payments, total: 1 });

            await getAllPayments(req as Request, res as Response, next);

            expect(db.Payments.getPayments).toHaveBeenCalledWith(0); // defaults to page 1
        });

        it('should handle errors during payments retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.Payments.getPayments as jest.Mock).mockRejectedValue(error);

            await getAllPayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle page 2 correctly', async () => {
            const payments = [{ payment_id: 3, amount: 2000, monthlyPayment_id: 3 }];
            req.query = { page: '2' };
            (db.Payments.getPayments as jest.Mock).mockResolvedValue({ payments, total: 25 });

            await getAllPayments(req as Request, res as Response, next);

            expect(db.Payments.getPayments).toHaveBeenCalledWith(10); // offset for page 2 (assuming limit is 10)
            expect(res.json).toHaveBeenCalledWith({
                data: payments,
                page: 2,
                totalPages: 3, // Math.ceil(25/10)
                total: 25
            });
        });
    });

    describe('getPaymentsId', () => {
        it('should retrieve a payment by ID', async () => {
            const payment = { payment_id: 1, amount: 1000, monthlyPayment_id: 1 };
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.getPaymentsId as jest.Mock).mockResolvedValue(payment);

            await getPaymentsId(req as Request, res as Response, next);

            expect(Payments.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.Payments.doesPaymentsExist).toHaveBeenCalledWith('1');
            expect(db.Payments.getPaymentsId).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(payment);
        });

        it('should return 404 if payment not found', async () => {
            req.params = { id: '999' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(false);

            await getPaymentsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'payments does not exist'
            });
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getPaymentsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during payment existence check', async () => {
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.Payments.doesPaymentsExist as jest.Mock).mockRejectedValue(error);

            await getPaymentsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during payment retrieval by ID', async () => {
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.Payments.getPaymentsId as jest.Mock).mockRejectedValue(error);

            await getPaymentsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getPaymentsByMonthlyPaymentId', () => {
        it('should retrieve payments by monthly payment ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const payments = [{ payment_id: 1, amount: 1000, monthlyPayment_id: 1 }];
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.getPaymentsByMonthlyPaymentId as jest.Mock).mockResolvedValue({ payments, total: 1 });

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(Payments.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
            expect(db.Payments.getPaymentsByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: payments,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if monthly payment does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '1' };
            req.query = {};
            const payments = [{ payment_id: 1, amount: 1000, monthlyPayment_id: 1 }];
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.getPaymentsByMonthlyPaymentId as jest.Mock).mockResolvedValue({ payments, total: 1 });

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(db.Payments.getPaymentsByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during monthly payment existence check', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(error);

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during payments retrieval by monthly payment ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.Payments.getPaymentsByMonthlyPaymentId as jest.Mock).mockRejectedValue(error);

            await getPaymentsByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updatePayments', () => {
        it('should update a payment successfully', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };

            const updatedPayment = { payment_id: 1, ...sanitized };

            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.updatePayments as jest.Mock).mockResolvedValue(updatedPayment);

            await updatePayments(req as Request, res as Response, next);

            expect(Payments.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(Payments.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(Payments.sanitize).toHaveBeenCalledWith(updateData, true);
            expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith(1);
            expect(db.Payments.updatePayments).toHaveBeenCalledWith('1', sanitized);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedPayment);
        });

        it('should return 404 if monthly payment does not exist during update', async () => {
            const updateData = {
                monthlyPayment_id: 999,
                amount: 1200,
                payment_date: '2023-12-02'
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 999,
                amount: 1200,
                payment_date: '2023-12-02'
            };

            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

            await updatePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = {};
            
            const sanitizeError = new Error('Invalid ID format');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updatePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = {};
            
            const sanitizeError = new Error('Body sanitization failed');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updatePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during monthly payment existence check in update', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };

            const dbError = new Error('Database error');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(dbError);

            await updatePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });

        it('should handle errors during payment update', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                amount: 1200,
                payment_date: '2023-12-02'
            };

            const dbError = new Error('Update failed');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (Payments.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.updatePayments as jest.Mock).mockRejectedValue(dbError);

            await updatePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });
    });

    describe('deletePayments', () => {
        it('should delete a payment successfully', async () => {
            const deletedPayment = { payment_id: 1, amount: 1000, monthlyPayment_id: 1 };
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(true);
            (db.Payments.deletePayments as jest.Mock).mockResolvedValue(deletedPayment);

            await deletePayments(req as Request, res as Response, next);

            expect(Payments.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.Payments.doesPaymentsExist).toHaveBeenCalledWith('1');
            expect(db.Payments.deletePayments).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedPayment);
        });

        it('should return 404 if payment does not exist', async () => {
            req.params = { id: '999' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(false);

            await deletePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'payments does not exist'
            });
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await deletePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during payment existence check', async () => {
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.Payments.doesPaymentsExist as jest.Mock).mockRejectedValue(error);

            await deletePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during payment deletion', async () => {
            req.params = { id: '1' };
            (Payments.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.Payments.doesPaymentsExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Delete failed');
            (db.Payments.deletePayments as jest.Mock).mockRejectedValue(error);

            await deletePayments(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
