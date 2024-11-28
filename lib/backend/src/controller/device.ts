import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { Device } from "@yaazoru/model";
import { handleError } from '../middleware';

const createDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        const deviceData = req.body;
        const sanitized = Device.sanitize(deviceData, false);
        await existingDevice(sanitized, false);
        const device = await db.Device.createDevice(sanitized);
        res.status(201).json(device);
    } catch (error: any) {
        handleError(res, error);
    }
};

const getDevices = async (req: Request, res: Response): Promise<void> => {
    try {
        const devices = await db.Device.getDevices();
        res.status(200).json(devices);
    } catch (error: any) {
        handleError(res, error)
    }
};

const getDeviceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.params.id)
            throw {
                status: 400,
                message: 'No ID provided'
            };
        const device = await db.Device.getDeviceById(req.params.id);
        if (!device) {
            return next({
                status: 404,
                message: 'device not found'
            });
        }
        res.status(200).json(device);
    } catch (error: any) {
        handleError(res, error);
    }
};

const updateDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body)
            throw {
                status: 400,
                message: 'No body provaider'
            }
        const sanitized = Device.sanitize(req.body, true);
        await existingDevice(sanitized, true);
        const updateDevice = await db.Device.updateDevice(req.params.id, sanitized);
        res.status(200).json(updateDevice);
    } catch (error: any) {
        handleError(res, error);
    }
};

const deleteDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.id)
            throw {
                status: 400,
                message: 'No ID provided'
            };

        const device = await db.Device.getDeviceById(req.params.id);

        if (!device) {
            throw {
                status: 404,
                message: 'Device not found'
            };
        }
        const deleteDevice = await db.Device.deleteDevice(req.params.id);
        res.status(200).json(deleteDevice);
    } catch (error: any) {
        handleError(res, error);
    }
};

const existingDevice = async (device: Device.Model, hasId: boolean) => {
    let deviceEx;
    if (hasId) {
        deviceEx = await db.Device.findDevice({
            device_id: device.device_id,
            SIM_number: device.SIM_number,
            IMEI_1: device.IMEI_1,
            mehalcha_number: device.mehalcha_number,
        });
    } else {
        deviceEx = await db.Device.findDevice({
            SIM_number: device.SIM_number,
            IMEI_1: device.IMEI_1,
            mehalcha_number: device.mehalcha_number,
        });
    }
    if (deviceEx) {
        if (deviceEx.SIM_number === device.SIM_number) {
            throw {
                status: 409,
                message: 'SIM_number already exists',
            };
        }
        if (deviceEx.IMEI_1 === device.IMEI_1) {
            throw {
                status: 409,
                message: 'IMEI_1 already exists',
            };
        }
        if (deviceEx.mehalcha_number === device.mehalcha_number) {
            throw {
                status: 409,
                message: 'mehalcha_number already exists',
            };
        }
    };
};

export {
    createDevice, getDevices, getDeviceById, updateDevice, deleteDevice,
}
