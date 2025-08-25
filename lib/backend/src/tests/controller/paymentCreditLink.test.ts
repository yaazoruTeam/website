import * as db from '../../db';
import { 
    createPaymentCreditLink, 
    getPaymentCreditLinks, 
    getPaymentCreditLinkId, 
    getPaymentCreditLinksByMonthlyPaymentId,
    getPaymentCreditLinksByCreditDetailsId,
    updatePaymentCreditLink, 
    deletePaymentCreditLink 
} from '../../controller/paymentCreditLink';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  PaymentCreditLink: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

import { PaymentCreditLink } from '../../../../model/src';

describe('PaymentCreditLink Controller Tests', () => {
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

    describe('createPaymentCreditLink', () => {
        it('should create a payment credit link successfully', async () => {
            const paymentCreditLinkData = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };
            req.body = paymentCreditLinkData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };

            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(false);
            (db.PaymentCreditLink.createPaymentCreditLink as jest.Mock).mockResolvedValue(paymentCreditLinkData);

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(PaymentCreditLink.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(PaymentCreditLink.sanitize).toHaveBeenCalledWith(paymentCreditLinkData, false);
            expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith(1);
            expect(db.CreditDetails.doesCreditDetailsExist).toHaveBeenCalledWith(1);
            expect(db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink).toHaveBeenCalledWith(1);
            expect(db.PaymentCreditLink.createPaymentCreditLink).toHaveBeenCalledWith(sanitized);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(paymentCreditLinkData);
        });

        it('should return 404 if monthly payment does not exist', async () => {
            const paymentCreditLinkData = {
                monthlyPayment_id: 999,
                creditDetails_id: 1
            };
            req.body = paymentCreditLinkData;

            const sanitized = {
                monthlyPayment_id: 999,
                creditDetails_id: 1
            };

            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should return 404 if credit details does not exist', async () => {
            const paymentCreditLinkData = {
                monthlyPayment_id: 1,
                creditDetails_id: 999
            };
            req.body = paymentCreditLinkData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 999
            };

            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(false);

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'credit details does not exist'
            });
        });

        it('should return 409 if monthly payment already exists in payment credit link', async () => {
            const paymentCreditLinkData = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };
            req.body = paymentCreditLinkData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };

            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'monthly payment already exists'
            });
        });

        it('should handle sanitization errors', async () => {
            req.body = {};
            const sanitizeError = new Error('Sanitization failed');
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle database errors during creation', async () => {
            const paymentCreditLinkData = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };
            req.body = paymentCreditLinkData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };

            const dbError = new Error('Database error');
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(dbError);

            await createPaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });
    });

    describe('getPaymentCreditLinks', () => {
        it('should retrieve all payment credit links with pagination', async () => {
            const paymentCreditLinks = [
                { id: 1, monthlyPayment_id: 1, creditDetails_id: 1 },
                { id: 2, monthlyPayment_id: 2, creditDetails_id: 2 }
            ];
            req.query = { page: '1' };
            (db.PaymentCreditLink.getPaymentCreditLinks as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 2 });

            await getPaymentCreditLinks(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.getPaymentCreditLinks).toHaveBeenCalledWith(0); // offset for page 1
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: paymentCreditLinks,
                page: 1,
                totalPages: 1,
                total: 2
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            req.query = {};
            (db.PaymentCreditLink.getPaymentCreditLinks as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinks(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.getPaymentCreditLinks).toHaveBeenCalledWith(0);
            expect(res.json).toHaveBeenCalledWith({
                data: paymentCreditLinks,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should handle errors during payment credit links retrieval', async () => {
            const error = new Error('Database error');
            req.query = { page: '1' };
            (db.PaymentCreditLink.getPaymentCreditLinks as jest.Mock).mockRejectedValue(error);

            await getPaymentCreditLinks(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle invalid page parameter', async () => {
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            req.query = { page: 'invalid' };
            (db.PaymentCreditLink.getPaymentCreditLinks as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinks(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.getPaymentCreditLinks).toHaveBeenCalledWith(0); // defaults to page 1
        });
    });

    describe('getPaymentCreditLinkId', () => {
        it('should retrieve a payment credit link by ID', async () => {
            const paymentCreditLink = { id: 1, monthlyPayment_id: 1, creditDetails_id: 1 };
            req.params = { id: '1' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.getPaymentCreditLinkId as jest.Mock).mockResolvedValue(paymentCreditLink);

            await getPaymentCreditLinkId(req as Request, res as Response, next);

            expect(PaymentCreditLink.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.PaymentCreditLink.doesPaymentCreditLinkExist).toHaveBeenCalledWith('1');
            expect(db.PaymentCreditLink.getPaymentCreditLinkId).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(paymentCreditLink);
        });

        it('should return 404 if payment credit link not found', async () => {
            req.params = { id: '999' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(false);

            await getPaymentCreditLinkId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'PaymentCreditLink does not exist.'
            });
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await getPaymentCreditLinkId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during payment credit link retrieval by ID', async () => {
            req.params = { id: '1' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('DB error');
            (db.PaymentCreditLink.getPaymentCreditLinkId as jest.Mock).mockRejectedValue(error);

            await getPaymentCreditLinkId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getPaymentCreditLinksByMonthlyPaymentId', () => {
        it('should retrieve payment credit links by monthly payment ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.getPaymentCreditLinksByMonthlyPaymentId as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinksByMonthlyPaymentId(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink).toHaveBeenCalledWith('1');
            expect(db.PaymentCreditLink.getPaymentCreditLinksByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: paymentCreditLinks,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if monthly payment does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(false);

            await getPaymentCreditLinksByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '1' };
            req.query = {};
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.getPaymentCreditLinksByMonthlyPaymentId as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinksByMonthlyPaymentId(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.getPaymentCreditLinksByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
        });

        it('should handle errors during retrieval by monthly payment ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const error = new Error('DB error');
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockRejectedValue(error);

            await getPaymentCreditLinksByMonthlyPaymentId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getPaymentCreditLinksByCreditDetailsId', () => {
        it('should retrieve payment credit links by credit details ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            (db.PaymentCreditLink.doesCreditDetailsExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.getPaymentCreditLinksByCreditDetailsId as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinksByCreditDetailsId(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.doesCreditDetailsExistInPaymentCreditLink).toHaveBeenCalledWith('1');
            expect(db.PaymentCreditLink.getPaymentCreditLinksByCreditDetailsId).toHaveBeenCalledWith('1', 0);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: paymentCreditLinks,
                page: 1,
                totalPages: 1,
                total: 1
            });
        });

        it('should return 404 if credit details does not exist', async () => {
            req.params = { id: '999' };
            req.query = { page: '1' };
            (db.PaymentCreditLink.doesCreditDetailsExistInPaymentCreditLink as jest.Mock).mockResolvedValue(false);

            await getPaymentCreditLinksByCreditDetailsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'credit details does not exist'
            });
        });

        it('should handle missing page parameter (default to page 1)', async () => {
            req.params = { id: '1' };
            req.query = {};
            const paymentCreditLinks = [{ id: 1, monthlyPayment_id: 1, creditDetails_id: 1 }];
            (db.PaymentCreditLink.doesCreditDetailsExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.getPaymentCreditLinksByCreditDetailsId as jest.Mock).mockResolvedValue({ paymentCreditLinks, total: 1 });

            await getPaymentCreditLinksByCreditDetailsId(req as Request, res as Response, next);

            expect(db.PaymentCreditLink.getPaymentCreditLinksByCreditDetailsId).toHaveBeenCalledWith('1', 0);
        });

        it('should handle errors during retrieval by credit details ID', async () => {
            req.params = { id: '1' };
            req.query = { page: '1' };
            const error = new Error('DB error');
            (db.PaymentCreditLink.doesCreditDetailsExistInPaymentCreditLink as jest.Mock).mockRejectedValue(error);

            await getPaymentCreditLinksByCreditDetailsId(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updatePaymentCreditLink', () => {
        it('should update a payment credit link successfully', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                creditDetails_id: 2
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 2
            };

            const updatedPaymentCreditLink = { id: 1, monthlyPayment_id: 1, creditDetails_id: 2 };

            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(false);
            (db.PaymentCreditLink.updatePaymentCreditLink as jest.Mock).mockResolvedValue(updatedPaymentCreditLink);

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(PaymentCreditLink.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(PaymentCreditLink.sanitizeBodyExisting).toHaveBeenCalledWith(req);
            expect(PaymentCreditLink.sanitize).toHaveBeenCalledWith(updateData, true);
            expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith(1);
            expect(db.CreditDetails.doesCreditDetailsExist).toHaveBeenCalledWith(2);
            expect(db.PaymentCreditLink.updatePaymentCreditLink).toHaveBeenCalledWith('1', sanitized);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedPaymentCreditLink);
        });

        it('should return 404 if monthly payment does not exist during update', async () => {
            const updateData = {
                monthlyPayment_id: 999,
                creditDetails_id: 1
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 999,
                creditDetails_id: 1
            };

            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'monthly payment does not exist'
            });
        });

        it('should return 409 if monthly payment already exists during update', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };

            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
            (db.CreditDetails.doesCreditDetailsExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink as jest.Mock).mockResolvedValue(true);

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'monthly payment already exists'
            });
        });

        it('should handle ID sanitization errors', async () => {
            req.params = { id: 'invalid' };
            req.body = {};
            
            const sanitizeError = new Error('Invalid ID format');
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle body sanitization errors', async () => {
            req.params = { id: '1' };
            req.body = {};
            
            const sanitizeError = new Error('Body sanitization failed');
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle database errors during update', async () => {
            const updateData = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };
            req.params = { id: '1' };
            req.body = updateData;

            const sanitized = {
                monthlyPayment_id: 1,
                creditDetails_id: 1
            };

            const dbError = new Error('Database error');
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
            (PaymentCreditLink.sanitize as jest.Mock).mockReturnValue(sanitized);
            (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(dbError);

            await updatePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });
    });

    describe('deletePaymentCreditLink', () => {
        it('should delete a payment credit link successfully', async () => {
            const deletedPaymentCreditLink = { id: 1, monthlyPayment_id: 1, creditDetails_id: 1 };
            req.params = { id: '1' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(true);
            (db.PaymentCreditLink.deletePaymentCreditLink as jest.Mock).mockResolvedValue(deletedPaymentCreditLink);

            await deletePaymentCreditLink(req as Request, res as Response, next);

            expect(PaymentCreditLink.sanitizeIdExisting).toHaveBeenCalledWith(req);
            expect(db.PaymentCreditLink.doesPaymentCreditLinkExist).toHaveBeenCalledWith('1');
            expect(db.PaymentCreditLink.deletePaymentCreditLink).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deletedPaymentCreditLink);
        });

        it('should return 404 if payment credit link does not exist', async () => {
            req.params = { id: '999' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(false);

            await deletePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'PaymentCreditLink does not exist.'
            });
        });

        it('should handle sanitization errors', async () => {
            req.params = { id: '1' };
            const sanitizeError = new Error('Invalid ID format');
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
                throw sanitizeError;
            });

            await deletePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(sanitizeError);
        });

        it('should handle errors during deletion', async () => {
            req.params = { id: '1' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockResolvedValue(true);
            const error = new Error('Delete failed');
            (db.PaymentCreditLink.deletePaymentCreditLink as jest.Mock).mockRejectedValue(error);

            await deletePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should handle errors during existence check', async () => {
            req.params = { id: '1' };
            (PaymentCreditLink.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
            const error = new Error('DB error');
            (db.PaymentCreditLink.doesPaymentCreditLinkExist as jest.Mock).mockRejectedValue(error);

            await deletePaymentCreditLink(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
