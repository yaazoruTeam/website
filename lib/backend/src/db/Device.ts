import { Device } from "@yaazoru/model";
import getConnection from "./connection";



const createDevice = async (device: Device.Model) => {
    const knex = getConnection();
    try {
        const [newDevice] = await knex('yaazoru.devices')
            .insert({
                SIM_number: device.SIM_number,
                IMEI_1: device.IMEI_1,
                mehalcha_number: device.mehalcha_number,
                model: device.model
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
        const deleteDevice = await knex('yaazoru.devices').where({ device_id }).del().returning('*');
        if (deleteDevice.length === 0) {
            throw { status: 404, message: 'Device not found' };
        }
        return deleteDevice[0];
    } catch (err) {
        throw err;
    };
};

const findDevice = async (criteria: { device_id?: string; SIM_number?: number; IMEI_1?: number; mehalcha_number?: number }) => {
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
    createDevice, getDevices, getDeviceById, updateDevice, deleteDevice, findDevice, doesDeviceExist
}
