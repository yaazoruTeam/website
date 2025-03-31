import { Device, HttpError } from "../model";
import getConnection from "./connection";



const createDevice = async (device: Device.Model) => {
    const knex = getConnection();
    try {
        const [newDevice] = await knex('yaazoru.devices')
            .insert({
                SIM_number: device.SIM_number,
                IMEI_1: device.IMEI_1,
                mehalcha_number: device.mehalcha_number,
                model: device.model,
                device_number: device.device_number,
            }).returning('*');
        return newDevice;
    }
    catch (err) {
        throw err;
    };
}

const getDevices = async (): Promise<Device.Model[]> => {
    const knex = getConnection();
    try {
        return await knex.select().table('yaazoru.devices');
    }
    catch (err) {
        throw err;
    };
}

const getDeviceById = async (device_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.devices').where({ device_id }).first();
    } catch (err) {
        throw err;
    };
};

const getDevicesByStatus = async (status: 'active' | 'inactive') => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.devices')
            .select()
            .where({ status });
    } catch (err) {
        throw err;
    };
};

const updateDevice = async (device_id: string, device: Device.Model) => {
    const knex = getConnection();
    try {
        const updateDevice = await knex('yaazoru.devices')
            .where({ device_id })
            .update(device)
            .returning('*');
        if (updateDevice.length === 0) {
            throw { status: 404, message: 'Device not found' };
        }
        return updateDevice[0];
    } catch (err) {
        throw err;
    };
};

const deleteDevice = async (device_id: string) => {
    const knex = getConnection();
    try {
        const updateDevice = await knex('yaazoru.devices')
            .where({ device_id })
            .update({ status: 'inactive' })
            .returning('*');
        if (updateDevice.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Device not found'
            }
            throw error;
        }
        return updateDevice[0];
    } catch (err) {
        throw err;
    }
};

const findDevice = async (criteria: { device_id?: string; SIM_number?: string; IMEI_1?: string; mehalcha_number?: string; device_number: string; }) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.devices')
            .where(function () {
                if (criteria.SIM_number) {
                    this.orWhere({ SIM_number: criteria.SIM_number });
                }
                if (criteria.IMEI_1) {
                    this.orWhere({ IMEI_1: criteria.IMEI_1 });
                }
                if (criteria.mehalcha_number) {
                    this.orWhere({ mehalcha_number: criteria.mehalcha_number });
                }
                if (criteria.device_number) {
                    this.orWhere({ device_number: criteria.device_number });
                }
            })
            .andWhere(function () {
                if (criteria.device_id) {
                    this.whereNot({ device_id: criteria.device_id });
                }
            })
            .first();
    } catch (err) {
        throw err;
    }
};

const doesDeviceExist = async (device_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.devices')
            .select('device_id')
            .where({ device_id })
            .first();
        return !!result;
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
    findDevice,
    doesDeviceExist
}
