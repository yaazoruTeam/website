import { NextFunction, Request, Response } from 'express';
import * as db from "../db";
import { Device, HttpError } from "../model";

const createDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Device.sanitizeBodyExisting(req);
        const deviceData = req.body;
        const sanitized = Device.sanitize(deviceData, false);
        await existingDevice(sanitized, false);
        const device = await db.Device.createDevice(sanitized);
        res.status(201).json(device);
    } catch (error: any) {
        next(error);
    }
};

const getDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const devices = await db.Device.getDevices();
        res.status(200).json(devices);
    } catch (error: any) {
        next(error);
    }
};

const getDeviceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Device.sanitizeIdExisting(req);
        const existDevice = await db.Device.doesDeviceExist(req.params.id);
        if (!existDevice) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Device does not exist.'
            };
            throw error;
        }
        const device = await db.Device.getDeviceById(req.params.id);
        res.status(200).json(device);
    } catch (error: any) {
        next(error);
    }
};

const getDevicesByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = req.params;
        if (status !== 'active' && status !== 'inactive') {
            const error: HttpError.Model = {
                status: 400,
                message: "Invalid status. Allowed values: 'active' or 'inactive'."
            };
            throw error;
        }
        const devices = await db.Device.getDevicesByStatus(status);
        res.status(200).json(devices);
    } catch (error: any) {
        next(error);
    }
};

const updateDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Device.sanitizeIdExisting(req);
        Device.sanitizeBodyExisting(req);
        const sanitized = Device.sanitize(req.body, true);
        await existingDevice(sanitized, true);
        const updateDevice = await db.Device.updateDevice(req.params.id, sanitized);
        res.status(200).json(updateDevice);
    } catch (error: any) {
        next(error);
    }
};

const deleteDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Device.sanitizeIdExisting(req);
        const existDevice = await db.Device.doesDeviceExist(req.params.id);
        if (!existDevice) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Device does not exist.'
            };
            throw error;
        }
        const deleteDevice = await db.Device.deleteDevice(req.params.id);
        res.status(200).json(deleteDevice);
    } catch (error: any) {
        next(error);
    }
};

const existingDevice = async (device: Device.Model, hasId: boolean) => {
    try {
        let deviceEx;
        if (hasId) {
            deviceEx = await db.Device.findDevice({
                device_id: device.device_id,
                SIM_number: device.SIM_number,
                IMEI_1: device.IMEI_1,
                mehalcha_number: device.mehalcha_number,
                device_number: device.device_number,
            });
        } else {
            deviceEx = await db.Device.findDevice({
                SIM_number: device.SIM_number,
                IMEI_1: device.IMEI_1,
                mehalcha_number: device.mehalcha_number,
                device_number: device.device_number,
            });
        }
        if (deviceEx) {
            try {
                Device.sanitizeExistingDevice(deviceEx, device);
            } catch (err) {
                throw err;
            }
        };
    } catch (err) {
        throw err;
    }
};

export {
    createDevice,
    getDevices,
    getDeviceById,
    getDevicesByStatus,
    updateDevice,
    deleteDevice,
}
