import { Request, Response, NextFunction } from 'express'
import { CustomerDevice } from '@model'
import * as db from '@db/index'
import {
  createCustomerDevice,
  getCustomersDevices,
  getCustomerDeviceById,
  getAllDevicesByCustomerId,
  getCustomerIdByDeviceId,
  updateCustomerDevice,
  deleteCustomerDevice,
} from '@controller/customerDevice'

// Mock the database module
jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  CustomerDevice: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
    sanitizeExistingCustomerDevice: jest.fn(),
  }
}))

describe('CustomerDevice Controller Tests', () => {
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

  describe('createCustomerDevice', () => {
    it('should create a new customer device successfully', async () => {
      const customerDeviceData = {
        customer_id: '1',
        device_id: '1',
        receivedAt: '2024-01-01',
        planEndDate: '2025-01-01',
        filterVersion: '1.0',
        deviceProgram: 'basic'
      };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(null);
      (db.CustomerDevice.createCustomerDevice as jest.Mock).mockResolvedValue(customerDeviceData);

      await createCustomerDevice(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(CustomerDevice.sanitize).toHaveBeenCalledWith(customerDeviceData, false);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
      expect(db.Device.doesDeviceExist).toHaveBeenCalledWith('1');
      expect(db.CustomerDevice.createCustomerDevice).toHaveBeenCalledWith(customerDeviceData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(customerDeviceData);
    });

    it('should handle customer not found error', async () => {
      const customerDeviceData = { customer_id: '999', device_id: '1' };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await createCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'customer does not exist.'
      });
    });

    it('should handle device not found error', async () => {
      const customerDeviceData = { customer_id: '1', device_id: '999' };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(false);

      await createCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'device does not exist.'
      });
    });

    it('should handle existing customer device validation error', async () => {
      const customerDeviceData = { customer_id: '1', device_id: '1' };
      const existingCustomerDevice = { customerDevice_id: '2', device_id: '1' };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(existingCustomerDevice);
      const validationError = new Error('Device already assigned');
      (CustomerDevice.sanitizeExistingCustomerDevice as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      await createCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('should handle sanitization body errors', async () => {
      req.body = {};
      const sanitizeError = new Error('Body sanitization failed');
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await createCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle database errors during creation', async () => {
      const customerDeviceData = { customer_id: '1', device_id: '1' };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(null);
      const dbError = new Error('Database creation error');
      (db.CustomerDevice.createCustomerDevice as jest.Mock).mockRejectedValue(dbError);

      await createCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getCustomersDevices', () => {
    it('should retrieve all customer devices with pagination', async () => {
      const customerDevices = [
        { customerDevice_id: 1, customer_id: '1', device_id: '1' },
        { customerDevice_id: 2, customer_id: '2', device_id: '2' }
      ];
      req.query = { page: '1' };
      (db.CustomerDevice.getCustomersDevices as jest.Mock).mockResolvedValue({ customerDevices, total: 2 });

      await getCustomersDevices(req as Request, res as Response, next);

      expect(db.CustomerDevice.getCustomersDevices).toHaveBeenCalledWith(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customerDevices,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const customerDevices = [{ customerDevice_id: 1, customer_id: '1' }];
      req.query = {};
      (db.CustomerDevice.getCustomersDevices as jest.Mock).mockResolvedValue({ customerDevices, total: 1 });

      await getCustomersDevices(req as Request, res as Response, next);

      expect(db.CustomerDevice.getCustomersDevices).toHaveBeenCalledWith(0);
      expect(res.json).toHaveBeenCalledWith({
        data: customerDevices,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it('should handle invalid page parameter', async () => {
      const customerDevices = [{ customerDevice_id: 1, customer_id: '1' }];
      req.query = { page: 'invalid' };
      (db.CustomerDevice.getCustomersDevices as jest.Mock).mockResolvedValue({ customerDevices, total: 1 });

      await getCustomersDevices(req as Request, res as Response, next);

      expect(db.CustomerDevice.getCustomersDevices).toHaveBeenCalledWith(0);
    });

    it('should handle errors during customer devices retrieval', async () => {
      const error = new Error('Database error');
      req.query = { page: '1' };
      (db.CustomerDevice.getCustomersDevices as jest.Mock).mockRejectedValue(error);

      await getCustomersDevices(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCustomerDeviceById', () => {
    it('should retrieve a customer device by ID', async () => {
      const customerDevice = { customerDevice_id: 1, customer_id: '1', device_id: '1' };
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceById as jest.Mock).mockResolvedValue(customerDevice);

      await getCustomerDeviceById(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.CustomerDevice.doesCustomerDeviceExist).toHaveBeenCalledWith('1');
      expect(db.CustomerDevice.getCustomerDeviceById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customerDevice);
    });

    it('should return 404 if customer device not found', async () => {
      req.params = { id: '999' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(false);

      await getCustomerDeviceById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'CustomerDevice does not exist.'
      });
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getCustomerDeviceById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during customer device existence check', async () => {
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockRejectedValue(error);

      await getCustomerDeviceById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during customer device retrieval by ID', async () => {
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.CustomerDevice.getCustomerDeviceById as jest.Mock).mockRejectedValue(error);

      await getCustomerDeviceById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllDevicesByCustomerId', () => {
    it('should retrieve all devices for a customer', async () => {
      const customerDevices = [
        { customerDevice_id: 1, customer_id: '1', device_id: '1' },
        { customerDevice_id: 2, customer_id: '1', device_id: '2' }
      ];
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceByCustomerId as jest.Mock).mockResolvedValue({ customerDevices, total: 2 });

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Customer.doesCustomerExist).toHaveBeenCalledWith('1');
      expect(db.CustomerDevice.getCustomerDeviceByCustomerId).toHaveBeenCalledWith('1', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customerDevices,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should return 404 if customer not found', async () => {
      req.params = { id: '999' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'Customer does not exist.'
      });
    });

    it('should return 404 if customer has no devices', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceByCustomerId as jest.Mock).mockResolvedValue({ customerDevices: [], total: 0 });

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'This customer has no devices.'
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const customerDevices = [{ customerDevice_id: 1, customer_id: '1' }];
      req.params = { id: '1' };
      req.query = {};
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceByCustomerId as jest.Mock).mockResolvedValue({ customerDevices, total: 1 });

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(db.CustomerDevice.getCustomerDeviceByCustomerId).toHaveBeenCalledWith('1', 0);
    });

    it('should handle errors during customer existence check', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB error');
      (db.Customer.doesCustomerExist as jest.Mock).mockRejectedValue(error);

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      req.query = { page: '1' };
      const sanitizeError = new Error('ID sanitization failed');
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getAllDevicesByCustomerId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });
  });

  describe('getCustomerIdByDeviceId', () => {
    it('should retrieve customer devices by device ID', async () => {
      const customerDevices = [{ customerDevice_id: 1, customer_id: '1', device_id: '1' }];
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceByDeviceId as jest.Mock).mockResolvedValue({ customerDevices, total: 1 });

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Device.doesDeviceExist).toHaveBeenCalledWith('1');
      expect(db.CustomerDevice.getCustomerDeviceByDeviceId).toHaveBeenCalledWith('1', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: customerDevices,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it('should return 404 if device not found', async () => {
      req.params = { id: '999' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(false);

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'device does not exist.'
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const customerDevices = [{ customerDevice_id: 1, customer_id: '1' }];
      req.params = { id: '1' };
      req.query = {};
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.getCustomerDeviceByDeviceId as jest.Mock).mockResolvedValue({ customerDevices, total: 1 });

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(db.CustomerDevice.getCustomerDeviceByDeviceId).toHaveBeenCalledWith('1', 0);
    });

    it('should handle errors during device existence check', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB error');
      (db.Device.doesDeviceExist as jest.Mock).mockRejectedValue(error);

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      req.query = { page: '1' };
      const sanitizeError = new Error('ID sanitization failed');
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during customer device retrieval by device ID', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.CustomerDevice.getCustomerDeviceByDeviceId as jest.Mock).mockRejectedValue(error);

      await getCustomerIdByDeviceId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateCustomerDevice', () => {
    it('should update a customer device successfully', async () => {
      const updatedCustomerDevice = { 
        customerDevice_id: '1',
        customer_id: '1', 
        device_id: '1',
        receivedAt: '2024-01-01'
      };
      req.params = { id: '1' };
      req.body = updatedCustomerDevice;
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(updatedCustomerDevice);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(null);
      (db.CustomerDevice.updateCustomerDevice as jest.Mock).mockResolvedValue(updatedCustomerDevice);

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(CustomerDevice.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(CustomerDevice.sanitize).toHaveBeenCalledWith(updatedCustomerDevice, true);
      expect(db.CustomerDevice.updateCustomerDevice).toHaveBeenCalledWith('1', updatedCustomerDevice);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCustomerDevice);
    });

    it('should handle customer not found during update', async () => {
      const customerDeviceData = { customer_id: '999', device_id: '1' };
      req.params = { id: '1' };
      req.body = customerDeviceData;
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(false);

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'customer does not exist.'
      });
    });

    it('should handle device not found during update', async () => {
      const customerDeviceData = { customer_id: '1', device_id: '999' };
      req.params = { id: '1' };
      req.body = customerDeviceData;
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(false);

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'device does not exist.'
      });
    });

    it('should handle ID sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle body sanitization errors', async () => {
      req.params = { id: '1' };
      req.body = {};
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Body sanitization failed');
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle existing customer device validation error during update', async () => {
      const customerDeviceData = { customerDevice_id: '1', customer_id: '1', device_id: '1' };
      const existingCustomerDevice = { customerDevice_id: '2', device_id: '1' };
      req.params = { id: '1' };
      req.body = customerDeviceData;

      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(existingCustomerDevice);
      const validationError = new Error('Device already assigned to another customer');
      (CustomerDevice.sanitizeExistingCustomerDevice as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('should handle errors during customer device update', async () => {
      const customerDeviceData = { customer_id: '1', device_id: '1' };
      req.params = { id: '1' };
      req.body = customerDeviceData;
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (CustomerDevice.sanitize as jest.Mock).mockReturnValue(customerDeviceData);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.findCustomerDevice as jest.Mock).mockResolvedValue(null);
      const error = new Error('Update failed');
      (db.CustomerDevice.updateCustomerDevice as jest.Mock).mockRejectedValue(error);

      await updateCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteCustomerDevice', () => {
    it('should delete a customer device successfully', async () => {
      const deletedCustomerDevice = { customerDevice_id: '1', customer_id: '1', device_id: '1' };
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(true);
      (db.CustomerDevice.deleteCustomerDevice as jest.Mock).mockResolvedValue(deletedCustomerDevice);

      await deleteCustomerDevice(req as Request, res as Response, next);

      expect(CustomerDevice.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.CustomerDevice.doesCustomerDeviceExist).toHaveBeenCalledWith('1');
      expect(db.CustomerDevice.deleteCustomerDevice).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedCustomerDevice);
    });

    it('should return 404 if customer device does not exist', async () => {
      req.params = { id: '999' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(false);

      await deleteCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'CustomerDevice does not exist.'
      });
    });

    it('should handle errors during customer device existence check', async () => {
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockRejectedValue(error);

      await deleteCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during deleteCustomerDevice', async () => {
      req.params = { id: '1' };
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.CustomerDevice.doesCustomerDeviceExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('Delete failed');
      (db.CustomerDevice.deleteCustomerDevice as jest.Mock).mockRejectedValue(error);

      await deleteCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (CustomerDevice.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await deleteCustomerDevice(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });
  });
});
