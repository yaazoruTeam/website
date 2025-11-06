jest.mock('../../repositories/CustomerRepository');
jest.mock('../../../../model/src', () => ({
  Customer: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
    sanitizeExistingCustomer: jest.fn(),
  },
  HttpError: {
    create: jest.fn(),
  }
}))

import { Request, Response, NextFunction } from "express";
import { customerRepository } from '../../repositories/CustomerRepository';
import { Customer, HttpError } from '../../../../model/src';
import { CustomerStatus } from '../../entities/Customer';
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
        address: '123 Main St',
      };

      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(req.body);

      await createCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitize).toHaveBeenCalledWith(req.body, false);
      expect(customerRepository.createCustomer).toHaveBeenCalledWith({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        id_number: req.body.id_number,
        phone_number: req.body.phone_number,
        additional_phone: null,
        email: req.body.email,
        city: req.body.city,
        address: req.body.address,
        status: 'active',
      });
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
      (customerRepository.createCustomer as jest.Mock).mockRejectedValue(error);

      await createCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getCustomers", () => {
    it("should return a list of customers with 200 status", async () => {
      const customers = [{ id: 1, name: "John Doe" }];
      req.query = { page: '1' };
      (customerRepository.getCustomers as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomers(req as Request, res as Response, next);

      expect(customerRepository.getCustomers).toHaveBeenCalled();
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
      (customerRepository.getCustomers as jest.Mock).mockRejectedValue(error);

      await getCustomers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer by ID with 200 status", async () => {
      req.params = { id: "1" };
      const customer = { customer_id: 1, first_name: "John", last_name: "Doe" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(customer);

      await getCustomerById(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(customerRepository.getCustomerById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customer);
    });

    it("should return 404 if customer does not exist", async () => {
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(null);

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
      (customerRepository.getCustomerById as jest.Mock).mockRejectedValue(error);

      await getCustomerById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  // בדיקות עבור getCustomersByCity
  describe("getCustomersByCity", () => {
    it("should return customers by city with 200 status", async () => {
      req.params = { city: "Tel Aviv" };
      req.query = { page: '1' };
      const customers = [{ customer_id: 1, city: "Tel Aviv" }];

      (customerRepository.find as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByCity(req as Request, res as Response, next);

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

      (customerRepository.find as jest.Mock).mockResolvedValue({ customers: [], total: 0 });

      await getCustomersByCity(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "No customers found in city: Unknown City",
      });
    });

    it("should call next with an error if fetching customers by city fails", async () => {
      const error = new Error("Database error");
      req.params = { city: "Tel Aviv" };
      req.query = { page: '1' };

      (customerRepository.find as jest.Mock).mockRejectedValue(error);

      await getCustomersByCity(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור getCustomersByStatus
  describe("getCustomersByStatus", () => {
    it("should return customers by status with 200 status", async () => {
      req.params = { status: "active" };
      req.query = { page: '1' };
      const customers = [{ customer_id: 1, status: "active" }];

      (customerRepository.find as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByStatus(req as Request, res as Response, next);

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

      (customerRepository.find as jest.Mock).mockRejectedValue(error);

      await getCustomersByStatus(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור getCustomersByDateRange
  describe("getCustomersByDateRange", () => {
    it("should return customers by date range with 200 status", async () => {
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31", page: '1' };
      const customers = [{ customer_id: 1, created_at: new Date() }];

      (customerRepository.findByDate as jest.Mock).mockResolvedValue({ customers, total: 1 });

      await getCustomersByDateRange(req as Request, res as Response, next);

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

      (customerRepository.findByDate as jest.Mock).mockResolvedValue({ customers: [], total: 0 });

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "No customers found between 2023-01-01 and 2023-12-31",
      });
    });

    it("should call next with an error if fetching customers by date range fails", async () => {
      const error = new Error("Database error");
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31", page: '1' };

      (customerRepository.findByDate as jest.Mock).mockRejectedValue(error);

      await getCustomersByDateRange(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור updateCustomer
  describe("updateCustomer", () => {
    it("should update a customer and return 200 status", async () => {
      req.params = { id: "1" };
      req.body = { first_name: "Jane", last_name: "Doe" };
      const updatedCustomer = { customer_id: 1, ...req.body };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (customerRepository.updateCustomer as jest.Mock).mockResolvedValue(updatedCustomer);

      await updateCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(Customer.sanitize).toHaveBeenCalledWith(req.body, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCustomer);
    });

    it("should call next with an error if updating customer fails", async () => {
      const error = new Error("Database error");
      req.params = { id: "1" };
      req.body = { first_name: "Jane", last_name: "Doe" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
      (Customer.sanitize as jest.Mock).mockReturnValue(req.body);
      (customerRepository.updateCustomer as jest.Mock).mockRejectedValue(error);

      await updateCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // בדיקות עבור deleteCustomer
  describe("deleteCustomer", () => {
    it("should delete a customer and return 200 status", async () => {
      req.params = { id: "1" };
      const deletedCustomer = { customer_id: 1, status: "inactive" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (customerRepository.deleteCustomer as jest.Mock).mockResolvedValue(deletedCustomer);

      await deleteCustomer(req as Request, res as Response, next);

      expect(Customer.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(customerRepository.deleteCustomer).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedCustomer);
    });

    it("should return 404 if customer does not exist", async () => {
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (customerRepository.deleteCustomer as jest.Mock).mockRejectedValue({
        status: 404,
        message: "Customer not found",
      });

      await deleteCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: "Customer not found",
      });
    });

    it("should call next with an error if deleting customer fails", async () => {
      const error = new Error("Database error");
      req.params = { id: "1" };

      (Customer.sanitizeIdExisting as jest.Mock).mockImplementation(() => { });
      (customerRepository.deleteCustomer as jest.Mock).mockRejectedValue(error);

      await deleteCustomer(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("existingCustomer", () => {
    const customer: Customer.Model = {
      customer_id: 1,
      email: "john.doe@example.com",
      id_number: "123456789",
      first_name: "John",
      last_name: "Doe",
      phone_number: "053-3016587",
      additional_phone: "",
      city: "Tel Aviv",
      address: "123 Main St",
      status: CustomerStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    test('existingCustomer should call sanitizeExistingCustomer if customer exists', async () => {
      const mockCustomer = {
        customer_id: 123,
        email: 'test@example.com',
        id_number: '123456789',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '053-3016587',
        additional_phone: "",
        city: 'Tel Aviv',
        address: '123 Main St',
        status: CustomerStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };
      const mockDbResponse = mockCustomer;

      (customerRepository.findExistingCustomer as jest.Mock).mockResolvedValue(mockDbResponse);
      const sanitizeSpy = jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => { });

      await existingCustomer(mockCustomer as Customer.Model, true);

      expect(sanitizeSpy).toHaveBeenCalledWith(mockDbResponse, mockCustomer);
    });

    test('existingCustomer should not call sanitizeExistingCustomer if customer does not exist', async () => {
      const mockCustomer = {
        customer_id: 123,
        email: 'new@example.com',
        id_number: '987654321',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '054-1234567',
        additional_phone: "",
        city: 'Haifa',
        address: '456 Another St',
        status: CustomerStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };

      (customerRepository.findExistingCustomer as jest.Mock).mockResolvedValue(null);

      const sanitizeSpy = jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => { });

      await existingCustomer(mockCustomer as Customer.Model, true);

      expect(sanitizeSpy).not.toHaveBeenCalled();
    });

    it('should throw error if customer with same id_number exists', async () => {
      const mockCustomer = {
        customer_id: 123,
        email: 'test@example.com',
        id_number: '123456789',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '053-3016587',
        additional_phone: "",
        city: 'Tel Aviv',
        address: '123 Main St',
        status: CustomerStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };

      const existing = {
        customer_id: 456,
        email: 'other@example.com',
        id_number: '123456789',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '054-1234567',
        additional_phone: "",
        city: 'Haifa',
        address: '456 Another St',
        status: CustomerStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(customerRepository, 'findExistingCustomer').mockResolvedValue(existing as any);
      jest.spyOn(Customer, 'sanitizeExistingCustomer').mockImplementation(() => {
        throw {
          status: 409,
          message: 'id_number already exists',
        };
      });

      await expect(existingCustomer(mockCustomer as Customer.Model, true)).rejects.toEqual({
        status: 409,
        message: 'id_number already exists',
      });
    });
  });
});
