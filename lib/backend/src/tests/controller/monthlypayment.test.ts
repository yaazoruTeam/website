import { Request, Response, NextFunction } from 'express'
import { MonthlyPayment } from '@model'
import * as db from '@db/index'
import {
  createMonthlyPayment,
  getMonthlyPayments,
  getMonthlyPaymentId,
  getMonthlyPaymentByCustomerId,
  getMonthlyPaymentsByStatus,
  getMonthlyPaymentByOrganization,
  updateMonthlyPayment,
  deleteMonthlyPayment,
} from '@controller/monthlypayment'

// Mock the database module
jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  MonthlyPayment: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

describe('MonthlyPayment Controller Tests', () => {
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

  describe('createMonthlyPayment', () => {
    it('should create a new monthly payment successfully', async () => {
      const monthlyPaymentData = {
        customer_id: '1',
        customer_name: 'John Doe',
        belongsOrganization: 'Test Org',
        start_date: '2024-01-01',
        amount: 100,
        frequency: 'monthly'
      };
      req.body = monthlyPaymentData;

      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockResolvedValue(monthlyPaymentData);

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(MonthlyPayment.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(MonthlyPayment.sanitize).toHaveBeenCalledWith(monthlyPaymentData, false);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
      expect(db.MonthlyPayment.createMonthlyPayment).toHaveBeenCalledWith(monthlyPaymentData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(monthlyPaymentData);
    });

    it('should handle customer not found error', async () => {
      const monthlyPaymentData = { customer_id: '999', amount: 100 };
      req.body = monthlyPaymentData;

      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'customer dose not exist'
      });
    });

    it('should handle sanitization body errors', async () => {
      req.body = {};
      const sanitizeError = new Error('Body sanitization failed');
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle sanitize model errors', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.body = monthlyPaymentData;

      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Model sanitization failed');
      (MonthlyPayment.sanitize as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle database errors during customer existence check', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.body = monthlyPaymentData;

      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      const dbError = new Error('Database error');
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(dbError);

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });

    it('should handle database errors during monthly payment creation', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.body = monthlyPaymentData;

      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      const dbError = new Error('Database creation error');
      (db.MonthlyPayment.createMonthlyPayment as jest.Mock).mockRejectedValue(dbError);

      await createMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getMonthlyPayments', () => {
    it('should retrieve all monthly payments with pagination', async () => {
      const monthlyPayments = [
        { monthlyPayment_id: 1, customer_name: 'John Doe', amount: 100 },
        { monthlyPayment_id: 2, customer_name: 'Jane Smith', amount: 200 }
      ];
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPayments as jest.Mock).mockResolvedValue({ monthlyPayments, total: 2 });

      await getMonthlyPayments(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPayments).toHaveBeenCalledWith(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: monthlyPayments,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, customer_name: 'John Doe' }];
      req.query = {};
      (db.MonthlyPayment.getMonthlyPayments as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPayments(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPayments).toHaveBeenCalledWith(0);
      expect(res.json).toHaveBeenCalledWith({
        data: monthlyPayments,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it('should handle invalid page parameter', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, customer_name: 'John Doe' }];
      req.query = { page: 'invalid' };
      (db.MonthlyPayment.getMonthlyPayments as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPayments(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPayments).toHaveBeenCalledWith(0);
    });

    it('should handle errors during monthly payments retrieval', async () => {
      const error = new Error('Database error');
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPayments as jest.Mock).mockRejectedValue(error);

      await getMonthlyPayments(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle large page numbers correctly', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, customer_name: 'John Doe' }];
      req.query = { page: '5' };
      (db.MonthlyPayment.getMonthlyPayments as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPayments(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPayments).toHaveBeenCalledWith(40); // (5-1) * 10
    });
  });

  describe('getMonthlyPaymentId', () => {
    it('should retrieve a monthly payment by ID', async () => {
      const monthlyPayment = { monthlyPayment_id: 1, customer_name: 'John Doe', amount: 100 };
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockResolvedValue(monthlyPayment);

      await getMonthlyPaymentId(req as Request, res as Response, next);

      expect(MonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
      expect(db.MonthlyPayment.getMonthlyPaymentById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(monthlyPayment);
    });

    it('should return 404 if monthly payment not found', async () => {
      req.params = { id: '999' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

      await getMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'monthlyPayment does not exist.'
      });
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during monthly payment existence check', async () => {
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during monthly payment retrieval by ID', async () => {
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.MonthlyPayment.getMonthlyPaymentById as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMonthlyPaymentByCustomerId', () => {
    it('should retrieve all monthly payments for a customer', async () => {
      const monthlyPayments = [
        { monthlyPayment_id: 1, customer_id: '1', amount: 100 },
        { monthlyPayment_id: 2, customer_id: '1', amount: 200 }
      ];
      req.params = { id: '1' };
      req.query = { page: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.getMonthlyPaymentsByCustomerId as jest.Mock).mockResolvedValue({ monthlyPayments, total: 2 });

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(MonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
      expect(db.MonthlyPayment.getMonthlyPaymentsByCustomerId).toHaveBeenCalledWith('1', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: monthlyPayments,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should return 404 if customer not found', async () => {
      req.params = { id: '999' };
      req.query = { page: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'customer does not exist.'
      });
    });

    it('should return 404 if no monthly payments found for customer', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.getMonthlyPaymentsByCustomerId as jest.Mock).mockResolvedValue({ monthlyPayments: [], total: 0 });

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'There is no monthly payment for this customer.'
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, customer_id: '1' }];
      req.params = { id: '1' };
      req.query = {};
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.getMonthlyPaymentsByCustomerId as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByCustomerId).toHaveBeenCalledWith('1', 0);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      req.query = { page: '1' };
      const sanitizeError = new Error('ID sanitization failed');
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during customer existence check', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB error');
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during monthly payments retrieval by customer ID', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.MonthlyPayment.getMonthlyPaymentsByCustomerId as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMonthlyPaymentsByStatus', () => {
    it('should retrieve monthly payments by valid status (active)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, status: 'active' }];
      req.params = { status: 'active' };
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPaymentsByStatus as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPaymentsByStatus(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByStatus).toHaveBeenCalledWith('active', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: monthlyPayments,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it('should retrieve monthly payments by valid status (inactive)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, status: 'inactive' }];
      req.params = { status: 'inactive' };
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPaymentsByStatus as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPaymentsByStatus(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByStatus).toHaveBeenCalledWith('inactive', 0);
    });

    it('should reject invalid status value', async () => {
      req.params = { status: 'invalid' };
      req.query = { page: '1' };

      await getMonthlyPaymentsByStatus(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        message: "Invalid status. Allowed values: 'active', 'inactive'."
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, status: 'active' }];
      req.params = { status: 'active' };
      req.query = {};
      (db.MonthlyPayment.getMonthlyPaymentsByStatus as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPaymentsByStatus(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByStatus).toHaveBeenCalledWith('active', 0);
    });

    it('should handle errors during getMonthlyPaymentsByStatus', async () => {
      req.params = { status: 'active' };
      req.query = { page: '1' };
      const error = new Error('DB error');
      (db.MonthlyPayment.getMonthlyPaymentsByStatus as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentsByStatus(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMonthlyPaymentByOrganization', () => {
    it('should retrieve monthly payments by organization', async () => {
      const monthlyPayments = [
        { monthlyPayment_id: 1, belongsOrganization: 'Test Org' },
        { monthlyPayment_id: 2, belongsOrganization: 'Test Org' }
      ];
      req.params = { organization: 'Test Org' };
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPaymentsByOrganization as jest.Mock).mockResolvedValue({ monthlyPayments, total: 2 });

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByOrganization).toHaveBeenCalledWith('Test Org', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: monthlyPayments,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should return 400 if organization parameter is missing', async () => {
      req.params = {};
      req.query = { page: '1' };

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        message: 'Invalid organization.'
      });
    });

    it('should return 400 if organization parameter is empty', async () => {
      req.params = { organization: '' };
      req.query = { page: '1' };

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        message: 'Invalid organization.'
      });
    });

    it('should return 404 if no monthly payments found for organization', async () => {
      req.params = { organization: 'Non-existent Org' };
      req.query = { page: '1' };
      (db.MonthlyPayment.getMonthlyPaymentsByOrganization as jest.Mock).mockResolvedValue({ monthlyPayments: [], total: 0 });

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'organization Non-existent Org not found'
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const monthlyPayments = [{ monthlyPayment_id: 1, belongsOrganization: 'Test Org' }];
      req.params = { organization: 'Test Org' };
      req.query = {};
      (db.MonthlyPayment.getMonthlyPaymentsByOrganization as jest.Mock).mockResolvedValue({ monthlyPayments, total: 1 });

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(db.MonthlyPayment.getMonthlyPaymentsByOrganization).toHaveBeenCalledWith('Test Org', 0);
    });

    it('should handle errors during monthly payments retrieval by organization', async () => {
      req.params = { organization: 'Test Org' };
      req.query = { page: '1' };
      const error = new Error('DB error');
      (db.MonthlyPayment.getMonthlyPaymentsByOrganization as jest.Mock).mockRejectedValue(error);

      await getMonthlyPaymentByOrganization(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMonthlyPayment', () => {
    it('should update a monthly payment successfully', async () => {
      const updatedMonthlyPayment = {
        monthlyPayment_id: '1',
        customer_id: '1',
        customer_name: 'John Doe Updated',
        amount: 150
      };
      req.params = { id: '1' };
      req.body = updatedMonthlyPayment;
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(updatedMonthlyPayment);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockResolvedValue(updatedMonthlyPayment);

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(MonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(MonthlyPayment.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(MonthlyPayment.sanitize).toHaveBeenCalledWith(updatedMonthlyPayment, true);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
      expect(db.MonthlyPayment.updateMonthlyPayment).toHaveBeenCalledWith('1', updatedMonthlyPayment);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedMonthlyPayment);
    });

    it('should handle customer not found during update', async () => {
      const monthlyPaymentData = { customer_id: '999', amount: 100 };
      req.params = { id: '1' };
      req.body = monthlyPaymentData;
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'customer dose not exist'
      });
    });

    it('should handle ID sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle body sanitization errors', async () => {
      req.params = { id: '1' };
      req.body = {};
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Body sanitization failed');
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle model sanitization errors', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.params = { id: '1' };
      req.body = monthlyPaymentData;
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Model sanitization failed');
      (MonthlyPayment.sanitize as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during customer existence check', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.params = { id: '1' };
      req.body = monthlyPaymentData;
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      const error = new Error('DB existence check error');
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during monthly payment update', async () => {
      const monthlyPaymentData = { customer_id: '1', amount: 100 };
      req.params = { id: '1' };
      req.body = monthlyPaymentData;
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (MonthlyPayment.sanitize as jest.Mock).mockReturnValue(monthlyPaymentData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('Update failed');
      (db.MonthlyPayment.updateMonthlyPayment as jest.Mock).mockRejectedValue(error);

      await updateMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteMonthlyPayment', () => {
    it('should delete a monthly payment successfully', async () => {
      const deletedMonthlyPayment = { monthlyPayment_id: '1', customer_name: 'John Doe', status: 'inactive' };
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.MonthlyPayment.deleteMonthlyPayment as jest.Mock).mockResolvedValue(deletedMonthlyPayment);

      await deleteMonthlyPayment(req as Request, res as Response, next);

      expect(MonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
      expect(db.MonthlyPayment.deleteMonthlyPayment).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedMonthlyPayment);
    });

    it('should return 404 if monthly payment does not exist', async () => {
      req.params = { id: '999' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

      await deleteMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'MonthlyPayment does not exist.'
      });
    });

    it('should handle errors during monthly payment existence check', async () => {
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(error);

      await deleteMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during deleteMonthlyPayment', async () => {
      req.params = { id: '1' };
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('Delete failed');
      (db.MonthlyPayment.deleteMonthlyPayment as jest.Mock).mockRejectedValue(error);

      await deleteMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (MonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await deleteMonthlyPayment(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });
  });
});
