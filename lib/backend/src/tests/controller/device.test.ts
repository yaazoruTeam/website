import * as db from '../../db';
import { Device } from '../../model';
import { createDevice, getDevices, getDeviceById, getDevicesByStatus, updateDevice, deleteDevice } from '../../controller/device';
import { Request, Response, NextFunction } from "express";

jest.mock("../../db");
jest.mock("../../model");

describe('Device Controller Tests', () => {
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

    describe('createDevice', () => {
        it('should create a new device successfully', async () => {
            const deviceData = { SIM_number: '12345', IMEI_1: '67890' };
            req.body = deviceData;

            (Device.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (Device.sanitize as jest.Mock).mockReturnValue(deviceData);
            (Device.sanitizeExistingDevice as jest.Mock).mockImplementation(() => { });
            (db.Device.findDevice as jest.Mock).mockResolvedValue(null);
            (db.Device.createDevice as jest.Mock).mockResolvedValue(deviceData);

            await createDevice(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(deviceData);
        });

        it('should handle errors during device creation', async () => {
            const deviceData = { SIM_number: '12345', IMEI_1: '67890' };
            req.body = deviceData;

            (Device.sanitizeBodyExisting as jest.Mock).mockImplementation(() => { });
            (Device.sanitize as jest.Mock).mockReturnValue(deviceData);
            (Device.sanitizeExistingDevice as jest.Mock).mockImplementation(() => { });
            (db.Device.findDevice as jest.Mock).mockResolvedValue(null);
            const error = new Error('Database error');
            (db.Device.createDevice as jest.Mock).mockRejectedValue(error);

            await createDevice(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
  describe('getDevices', () => {
        it('should retrieve all devices', async () => {
            const devices = [{ SIM_number: '12345', IMEI_1: '67890' }];
            (db.Device.getDevices as jest.Mock).mockResolvedValue(devices);

            await getDevices(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(devices);
        });

        it('should handle errors during device retrieval', async () => {
            const error = new Error('Database error');
            (db.Device.getDevices as jest.Mock).mockRejectedValue(error);

            await getDevices(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getDeviceById', () => {
        it('should retrieve a device by ID', async () => {
            const device = { SIM_number: '12345', IMEI_1: '67890' };
            req.params = { id: '1' };
            (db.Device.getDeviceById as jest.Mock).mockResolvedValue(device);

            await getDeviceById(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(device);
        });

        it('should return 404 if device not found', async () => {
            req.params = { id: '999' };
            (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(false);

            await getDeviceById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'Device does not exist.'
            });
        });

        it('should handle errors during device retrieval by ID', async () => {
            req.params = { id: '1' };
            const error = new Error('DB error');
            (db.Device.doesDeviceExist as jest.Mock).mockRejectedValue(error);

            await getDeviceById(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getDevicesByStatus', () => {
        it('should retrieve devices by valid status', async () => {
            req.params = { status: 'active' };
            const devices = [{ id: '1' }];
            (db.Device.getDevicesByStatus as jest.Mock).mockResolvedValue(devices);

            await getDevicesByStatus(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(devices);
        });

        it('should reject invalid status value', async () => {
            req.params = { status: 'invalid' };

            await getDevicesByStatus(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 400,
                message: "Invalid status. Allowed values: 'active' or 'inactive'."
            });
        });

        it('should handle error during getDevicesByStatus', async () => {
            req.params = { status: 'inactive' };
            const error = new Error('DB error');
            (db.Device.getDevicesByStatus as jest.Mock).mockRejectedValue(error);

            await getDevicesByStatus(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateDevice', () => {
        it('should update a device successfully', async () => {
            const updated = { SIM_number: '11111' };
            req.params = { id: '1' };
            req.body = updated;
            (db.Device.updateDevice as jest.Mock).mockResolvedValue(updated);

            await updateDevice(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updated);
        });

        it('should handle error during device update', async () => {
            req.params = { id: '1' };
            req.body = { SIM_number: '11111' };
            const error = new Error('Update failed');
            (db.Device.updateDevice as jest.Mock).mockRejectedValue(error);

            await updateDevice(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteDevice', () => {
        it('should delete a device successfully', async () => {
            const deleted = { id: '1' };
            req.params = { id: '1' };
            (db.Device.deleteDevice as jest.Mock).mockResolvedValue(deleted);

            await deleteDevice(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deleted);
        });

        it('should return 404 if device does not exist', async () => {
            req.params = { id: '999' };
            (db.Device.doesDeviceExist as jest.Mock).mockResolvedValue(false);

            await deleteDevice(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'Device does not exist.'
            });
        });

        it('should handle errors during deleteDevice', async () => {
            req.params = { id: '1' };
            const error = new Error('Delete failed');
            (db.Device.deleteDevice as jest.Mock).mockRejectedValue(error);

            await deleteDevice(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
