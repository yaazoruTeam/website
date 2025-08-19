import { Request, Response, NextFunction } from 'express'
import { ItemForMonthlyPayment } from '@model'
import * as db from '@db/index'
import {
  createItem,
  getItems,
  getItemId,
  getAllItemsByMonthlyPaymentId,
  updateItem,
  deleteItem,
} from '@controller/item'

// Mock the database module
jest.mock("../../db");
jest.mock('../../../../model/src', () => ({
  ItemForMonthlyPayment: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
  }
}))

describe('Item Controller Tests', () => {
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

  describe('createItem', () => {
    it('should create a new item successfully', async () => {
      const itemData = {
        monthlyPayment_id: '1',
        description: 'Test item',
        quantity: 2,
        price: 100,
        total: 200,
        paymentType: 'credit'
      };
      req.body = itemData;

      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.createItem as jest.Mock).mockResolvedValue(itemData);

      await createItem(req as Request, res as Response, next);

      expect(ItemForMonthlyPayment.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(ItemForMonthlyPayment.sanitize).toHaveBeenCalledWith(itemData, false);
      expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
      expect(db.Item.createItem).toHaveBeenCalledWith(itemData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(itemData);
    });

    it('should handle monthly payment not found error', async () => {
      const itemData = { monthlyPayment_id: '999', description: 'Test item' };
      req.body = itemData;

      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

      await createItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'monthly payment dose not exist'
      });
    });

    it('should handle sanitization body errors', async () => {
      req.body = {};
      const sanitizeError = new Error('Body sanitization failed');
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await createItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle sanitize model errors', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.body = itemData;

      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Model sanitization failed');
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await createItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle database errors during monthly payment existence check', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.body = itemData;

      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      const dbError = new Error('Database error');
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(dbError);

      await createItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });

    it('should handle database errors during item creation', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.body = itemData;

      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      const dbError = new Error('Database creation error');
      (db.Item.createItem as jest.Mock).mockRejectedValue(dbError);

      await createItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getItems', () => {
    it('should retrieve all items with pagination', async () => {
      const items = [
        { item_id: 1, description: 'Item 1', price: 100 },
        { item_id: 2, description: 'Item 2', price: 200 }
      ];
      req.query = { page: '1' };
      (db.Item.getItems as jest.Mock).mockResolvedValue({ items, total: 2 });

      await getItems(req as Request, res as Response, next);

      expect(db.Item.getItems).toHaveBeenCalledWith(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: items,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const items = [{ item_id: 1, description: 'Item 1' }];
      req.query = {};
      (db.Item.getItems as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getItems(req as Request, res as Response, next);

      expect(db.Item.getItems).toHaveBeenCalledWith(0);
      expect(res.json).toHaveBeenCalledWith({
        data: items,
        page: 1,
        totalPages: 1,
        total: 1
      });
    });

    it('should handle invalid page parameter', async () => {
      const items = [{ item_id: 1, description: 'Item 1' }];
      req.query = { page: 'invalid' };
      (db.Item.getItems as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getItems(req as Request, res as Response, next);

      expect(db.Item.getItems).toHaveBeenCalledWith(0);
    });

    it('should handle errors during items retrieval', async () => {
      const error = new Error('Database error');
      req.query = { page: '1' };
      (db.Item.getItems as jest.Mock).mockRejectedValue(error);

      await getItems(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle large page numbers correctly', async () => {
      const items = [{ item_id: 1, description: 'Item 1' }];
      req.query = { page: '5' };
      (db.Item.getItems as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getItems(req as Request, res as Response, next);

      expect(db.Item.getItems).toHaveBeenCalledWith(40); // (5-1) * 10
    });
  });

  describe('getItemId', () => {
    it('should retrieve an item by ID', async () => {
      const item = { item_id: 1, description: 'Test item', price: 100 };
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(true);
      (db.Item.getItemId as jest.Mock).mockResolvedValue(item);

      await getItemId(req as Request, res as Response, next);

      expect(ItemForMonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Item.doesItemExist).toHaveBeenCalledWith('1');
      expect(db.Item.getItemId).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('should return 404 if item not found', async () => {
      req.params = { id: '999' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(false);

      await getItemId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'Item does not exist.'
      });
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getItemId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during item existence check', async () => {
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.Item.doesItemExist as jest.Mock).mockRejectedValue(error);

      await getItemId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during item retrieval by ID', async () => {
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.Item.getItemId as jest.Mock).mockRejectedValue(error);

      await getItemId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllItemsByMonthlyPaymentId', () => {
    it('should retrieve all items for a monthly payment', async () => {
      const items = [
        { item_id: 1, monthlyPayment_id: '1', description: 'Item 1' },
        { item_id: 2, monthlyPayment_id: '1', description: 'Item 2' }
      ];
      req.params = { id: '1' };
      req.query = { page: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.getAllItemByMonthlyPaymentId as jest.Mock).mockResolvedValue({ items, total: 2 });

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(ItemForMonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
      expect(db.Item.getAllItemByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: items,
        page: 1,
        totalPages: 1,
        total: 2
      });
    });

    it('should return 404 if monthly payment not found', async () => {
      req.params = { id: '999' };
      req.query = { page: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'monthlyPayment does not exist.'
      });
    });

    it('should handle missing page parameter (default to page 1)', async () => {
      const items = [{ item_id: 1, monthlyPayment_id: '1' }];
      req.params = { id: '1' };
      req.query = {};
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.getAllItemByMonthlyPaymentId as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(db.Item.getAllItemByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
    });

    it('should handle invalid page parameter', async () => {
      const items = [{ item_id: 1, monthlyPayment_id: '1' }];
      req.params = { id: '1' };
      req.query = { page: 'invalid' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.getAllItemByMonthlyPaymentId as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(db.Item.getAllItemByMonthlyPaymentId).toHaveBeenCalledWith('1', 0);
    });

    it('should handle errors during monthly payment existence check', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB error');
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(error);

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      req.query = { page: '1' };
      const sanitizeError = new Error('ID sanitization failed');
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during items retrieval by monthly payment ID', async () => {
      req.params = { id: '1' };
      req.query = { page: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('DB retrieval error');
      (db.Item.getAllItemByMonthlyPaymentId as jest.Mock).mockRejectedValue(error);

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle large page numbers correctly', async () => {
      const items = [{ item_id: 1, monthlyPayment_id: '1' }];
      req.params = { id: '1' };
      req.query = { page: '3' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.getAllItemByMonthlyPaymentId as jest.Mock).mockResolvedValue({ items, total: 1 });

      await getAllItemsByMonthlyPaymentId(req as Request, res as Response, next);

      expect(db.Item.getAllItemByMonthlyPaymentId).toHaveBeenCalledWith('1', 20); // (3-1) * 10
    });
  });

  describe('updateItem', () => {
    it('should update an item successfully', async () => {
      const updatedItem = {
        item_id: '1',
        monthlyPayment_id: '1',
        description: 'Updated item',
        price: 150
      };
      req.params = { id: '1' };
      req.body = updatedItem;
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(updatedItem);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      (db.Item.updateItem as jest.Mock).mockResolvedValue(updatedItem);

      await updateItem(req as Request, res as Response, next);

      expect(ItemForMonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(ItemForMonthlyPayment.sanitizeBodyExisting).toHaveBeenCalledWith(req);
      expect(ItemForMonthlyPayment.sanitize).toHaveBeenCalledWith(updatedItem, true);
      expect(db.MonthlyPayment.doesMonthlyPaymentExist).toHaveBeenCalledWith('1');
      expect(db.Item.updateItem).toHaveBeenCalledWith('1', updatedItem);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should handle monthly payment not found during update', async () => {
      const itemData = { monthlyPayment_id: '999', description: 'Test item' };
      req.params = { id: '1' };
      req.body = itemData;
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(false);

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'monthly payment dose not exist'
      });
    });

    it('should handle ID sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle body sanitization errors', async () => {
      req.params = { id: '1' };
      req.body = {};
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Body sanitization failed');
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle model sanitization errors', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.params = { id: '1' };
      req.body = itemData;
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      const sanitizeError = new Error('Model sanitization failed');
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });

    it('should handle errors during monthly payment existence check', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.params = { id: '1' };
      req.body = itemData;
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      const error = new Error('DB existence check error');
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockRejectedValue(error);

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during item update', async () => {
      const itemData = { monthlyPayment_id: '1', description: 'Test item' };
      req.params = { id: '1' };
      req.body = itemData;
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {});
      (ItemForMonthlyPayment.sanitize as jest.Mock).mockReturnValue(itemData);
      (db.MonthlyPayment.doesMonthlyPaymentExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('Update failed');
      (db.Item.updateItem as jest.Mock).mockRejectedValue(error);

      await updateItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item successfully', async () => {
      const deletedItem = { item_id: '1', description: 'Test item', price: 100 };
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(true);
      (db.Item.deleteItem as jest.Mock).mockResolvedValue(deletedItem);

      await deleteItem(req as Request, res as Response, next);

      expect(ItemForMonthlyPayment.sanitizeIdExisting).toHaveBeenCalledWith(req);
      expect(db.Item.doesItemExist).toHaveBeenCalledWith('1');
      expect(db.Item.deleteItem).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedItem);
    });

    it('should return 404 if item does not exist', async () => {
      req.params = { id: '999' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(false);

      await deleteItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        status: 404,
        message: 'Item does not exist.'
      });
    });

    it('should handle errors during item existence check', async () => {
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      const error = new Error('DB existence check error');
      (db.Item.doesItemExist as jest.Mock).mockRejectedValue(error);

      await deleteItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle errors during deleteItem', async () => {
      req.params = { id: '1' };
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {});
      (db.Item.doesItemExist as jest.Mock).mockResolvedValue(true);
      const error = new Error('Delete failed');
      (db.Item.deleteItem as jest.Mock).mockRejectedValue(error);

      await deleteItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle sanitization errors', async () => {
      req.params = { id: 'invalid' };
      const sanitizeError = new Error('ID sanitization failed');
      (ItemForMonthlyPayment.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw sanitizeError;
      });

      await deleteItem(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(sanitizeError);
    });
  });
});
