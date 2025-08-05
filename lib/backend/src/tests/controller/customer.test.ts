jest.mock('@db');
jest.mock('@model');
import { Request, Response, NextFunction } from "express";
import * as db from '../../db';
import { Customer, HttpError } from '../../../../model/src';
import { createCustomer, deleteCustomer, existingCustomer, getCustomerById, getCustomers, getCustomersByCity, getCustomersByDateRange, getCustomersByStatus, updateCustomer } from "../../controller/customer";


describe("Customer Controller", () => {
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

  describe("createCustomer", () => {
    it("should create a new customer and return 201 status", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        id_number: "123456789",
        phone_number: '053-3016587',
        city: 'Tel Aviv',
        address1: '123 Main St',
      };

      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (db.Customer.createCustomer as jest.Mock).mockResolvedValue(req.body);

      await createCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitize).toHaveBeenCalledWith(req.body, false);
      expect(db.Customer.createCustomer).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("should call next with an error if customer creation fails", async () => {
      const error = new Error("Database error");
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        id_number: "123456789",
      };

      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (db.Customer.createCustomer as jest.Mock).mockRejectedValue(error);

      await createCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getCustomers", () => {
    it("should return a list of customers with 200 status", async () => {
      const customers = [{ id: 1, name: "John Doe" }];
      req.query = { page: '1' };
      (db.Customer.getCustomers as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomers(req as Request, res as Response, next);

      expect(db.Customer.getCustomers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customers,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it("should call next with an error if fetching customers fails", async () => {
      const error = new Error("Database error");
      req.query = { page: '1' };
      (db.Customer.getCustomers as jest.Mock).mockRejectedValue(error);

      await getCustomers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer by ID with 200 status", async () => {
      req.params = { id: "1" };
      const customer = { id: 1, name: "John Doe" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Customer.getCustomerById as jest.Mock).mockResolvedValue(customer);

      await getCustomerById(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith("1");
      expect(db.Customer.getCustomerById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customer);
    });

    it("should return 404 if customer does not exist", async () => {
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await getCustomerById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "Customer does not exist.",
      });
    });

    it("should call next with an error if fetching customer fails", async () => {
      const error = new Error("Database error");
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

      await getCustomerById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  // בדיקות עבור getCustomersByCity
  describe("getCustomersByCity", () => {
    it("should return customers by city with 200 status", async () => {
      req.params = { city: "New York" };
      req.query = { page: '1' };
      const customers = [{ id: 1, name: "John Doe" }];

      (db.Customer.getCustomersByCity as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByCity(req as Request, res as Response, next);

      expect(db.Customer.getCustomersByCity).toHaveBeenCalledWith("New York", 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customers,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it("should return 404 if no customers found in the city", async () => {
      req.params = { city: "Unknown City" };
      req.query = { page: '1' };

      (db.Customer.getCustomersByCity as jest.Mock).mockResolvedValue({ customers: [], total: 0 });

      await getCustomersByCity(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "No customers found in city: Unknown City",
      });
    });

    it("should call next with an error if fetching customers by city fails", async () => {
      const error = new Error("Database error");
      req.params = { city: "New York" };
      req.query = { page: '1' };

      (db.Customer.getCustomersByCity as jest.Mock).mockRejectedValue(error);

      await getCustomersByCity(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור getCustomersByStatus
  describe("getCustomersByStatus", () => {
    it("should return customers by status with 200 status", async () => {
      req.params = { status: "active" };
      req.query = { page: '1' };
      const customers = [{ id: 1, name: "John Doe" }];

      (db.Customer.getCustomersByStatus as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByStatus(req as Request, res as Response, next);

      expect(db.Customer.getCustomersByStatus).toHaveBeenCalledWith("active", 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customers,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it("should return 400 for invalid status", async () => {
      req.params = { status: "invalid" };
      req.query = { page: '1' };

      await getCustomersByStatus(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      });
    });

    it("should call next with an error if fetching customers by status fails", async () => {
      const error = new Error("Database error");
      req.params = { status: "active" };
      req.query = { page: '1' };

      (db.Customer.getCustomersByStatus as jest.Mock).mockRejectedValue(error);

      await getCustomersByStatus(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור getCustomersByDateRange
  describe("getCustomersByDateRange", () => {
    it("should return customers by date range with 200 status", async () => {
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31", page: '1' };
      const customers = [{ id: 1, name: "John Doe" }];

      (db.Customer.getCustomersByDateRange as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(db.Customer.getCustomersByDateRange).toHaveBeenCalledWith("2023-01-01", "2023-12-31", 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customers,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it("should return 400 if startDate or endDate is missing", async () => {
      req.query = { startDate: "2023-01-01" };

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 400,
        message: "Both startDate and endDate parameters are required.",
      });
    });

    it("should return 404 if no customers found in the date range", async () => {
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31", page: '1' };

      (db.Customer.getCustomersByDateRange as jest.Mock).mockResolvedValue({ customers: [], total: 0 });

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "No customers found between 2023-01-01 and 2023-12-31",
      });
    });

    it("should call next with an error if fetching customers by date range fails", async () => {
      const error = new Error("Database error");
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31", page: '1' };

      (db.Customer.getCustomersByDateRange as jest.Mock).mockRejectedValue(error);

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור updateCustomer
  describe("updateCustomer", () => {
    it("should update a customer and return 200 status", async () => {
      req.params = { id: "1" };
      req.body = { first_name: "Jane", last_name: "Doe" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (db.Customer.updateCustomer as jest.Mock).mockResolvedValue(req.body);

      await updateCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitize).toHaveBeenCalledWith(req.body, true);
      expect(db.Customer.updateCustomer).toHaveBeenCalledWith("1", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("should call next with an error if updating customer fails", async () => {
      const error = new Error("Database error");
      req.params = { id: "1" };
      req.body = { first_name: "Jane", last_name: "Doe" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (db.Customer.updateCustomer as jest.Mock).mockRejectedValue(error);

      await updateCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור deleteCustomer
  describe("deleteCustomer", () => {
    it("should delete a customer and return 200 status", async () => {
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Customer.deleteCustomer as jest.Mock).mockResolvedValue({ success: true });

      await deleteCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith("1");
      expect(db.Customer.deleteCustomer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return 404 if customer does not exist", async () => {
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await deleteCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "Customer does not exist.",
      });
    });

    it("should call next with an error if deleting customer fails", async () => {
      const error = new Error("Database error");
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

      await deleteCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("existingCustomer", () => {

    const customer: Customer.Model = {
      customer_id: "1",
      email: "john.doe@example.com",
      id_number: "123456789",
      first_name: "John",
      last_name: "Doe",
      phone_number: "053-3016587",
      additional_phone: '',
      city: "Tel Aviv",
      address1: "123 Main St",
      address2: '',
      zipCode: "12345",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    };
    test('existingCustomer should call sanitizeExistingCustomer if customer exists', async () => {
      const mockCustomer = {
        customer_id: '123',
        email: 'test@example.com',
        id_number: '123456789',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '053-3016587',
        additional_phone: '',
        city: 'Tel Aviv',
        address1: '123 Main St',
        address2: '',
        zipCode: '12345',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };
      const mockDbResponse = mockCustomer;

      (db.Customer.findCustomer as jest.Mock).mockResolvedValue(mockDbResponse);
      const sanitizeSpy = jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => { });

      await existingCustomer(mockCustomer, true);

      expect(sanitizeSpy).toHaveBeenCalledWith(mockDbResponse, mockCustomer);
    });
    test('existingCustomer should not call sanitizeExistingCustomer if customer does not exist', async () => {
      const mockCustomer = {
        customer_id: '123',
        email: 'new@example.com',
        id_number: '987654321',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '054-1234567',
        additional_phone: '',
        city: 'Haifa',
        address1: '456 Another St',
        address2: '',
        zipCode: '54321',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      (db.Customer.findCustomer as jest.Mock).mockResolvedValue(undefined);

      const sanitizeSpy = jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => { });

      await existingCustomer(mockCustomer, true);

      expect(sanitizeSpy).not.toHaveBeenCalled();
    });

    it('should throw error if customer with same id_number exists', async () => {
      const mockCustomer = {
        customer_id: '123',
        email: 'test@example.com',
        id_number: '123456789',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '053-3016587',
        additional_phone: '',
        city: 'Tel Aviv',
        address1: '123 Main St',
        address2: '',
        zipCode: '12345',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      const existing = {
        email: 'other@example.com',
        id_number: '123456789',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '054-1234567',
        additional_phone: '',
        city: 'Haifa',
        address1: '456 Another St',
        address2: '',
        zipCode: '54321',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(db.Customer, 'findCustomer').mockResolvedValue(existing);
      jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => {
        throw {
          status: 409,
          message: 'id_number already exists',
        };
      });

      await expect(existingCustomer(mockCustomer, true)).rejects.toEqual({
        status: 409,
        message: 'id_number already exists',
      });
    });
  });
});
