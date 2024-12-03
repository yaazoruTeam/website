import { Request, Response } from 'express';
import db from "../db";
import { Device } from "../model";

const createDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        const deviceData = req.body;
        const sanitized = Device.sanitize(deviceData, false);
        const devices: Device.Model[] = await db.Device.getDevices();
        const existingDevice = devices?.find(device => device.SIM_number === sanitized.SIM_number || device.IMEI_1 === sanitized.IMEI_1 || device.mehalcha_number === device.mehalcha_number);
        if (existingDevice) {
            if (existingDevice.SIM_number === sanitized.SIM_number) {
                throw {
                    status: 409,
                    message: 'SIM_number already exists',
                };
            }
            if (existingDevice.IMEI_1 === sanitized.IMEI_1) {
                throw {
                    status: 409,
                    message: 'IMEI_1 already exists',
                };
            }
            if (existingDevice.mehalcha_number === sanitized.mehalcha_number) {
                throw {
                    status: 409,
                    message: 'mehalcha_number already exists',
                };
            }
        }
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

const getDeviceById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.id)
            throw {
                status: 400,
                message: 'No ID provided'
            };
        const device = await db.Device.getDeviceById(req.params.id);
        if (!device) {
            res.status(404).json({ message: 'device not found' });
            return;
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
        const devices: Device.Model[] = await db.Device.getDevices();
        const existingDevice = devices?.find(device => device.SIM_number === sanitized.SIM_number || device.IMEI_1 === sanitized.IMEI_1 || device.mehalcha_number === device.mehalcha_number);
        if (existingDevice) {
            if (existingDevice.SIM_number === sanitized.SIM_number) {
                throw {
                    status: 409,
                    message: 'SIM_number already exists',
                };
            }
            if (existingDevice.IMEI_1 === sanitized.IMEI_1) {
                throw {
                    status: 409,
                    message: 'IMEI_1 already exists',
                };
            }
            if (existingDevice.mehalcha_number === sanitized.mehalcha_number) {
                throw {
                    status: 409,
                    message: 'mehalcha_number already exists',
                };
            }
        }
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
        const deleteDevice = await db.Device.deleteDevice(req.params.id);
        res.status(200).json(deleteDevice);
    } catch (error: any) {
        handleError(res, error);
    }
};

const handleError = (res: Response, error: any): void => {
    console.error('Error:', error.message);
    if (error.status) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export {
    createDevice, getDevices, getDeviceById, updateDevice, deleteDevice,
}
