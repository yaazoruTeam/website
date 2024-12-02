import { HttpError } from ".";

interface Model {
    device_id: string;
    SIM_number: number;
    IMEI_1: number;
    mehalcha_number: number;
    model: string;
}


function sanitize(device: Model, hasId: boolean): Model {

    if (hasId && (!device.device_id)) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "device_id".'
        };
        throw error;
    }
    if (!device.SIM_number) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "SIM_number".'
        };
        throw error;
    }
    if (!device.IMEI_1) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "IMEI_1".'
        };
        throw error;
    }
    if (!device.mehalcha_number) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "mehalcha_number".'
        };
        throw error;
    }
    if (!device.model) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "model".'
        };
        throw error;
    }


    const newDevice: Model = {
        device_id: device.device_id,
        SIM_number: device.SIM_number,
        IMEI_1: device.IMEI_1,
        mehalcha_number: device.mehalcha_number,
        model: device.model,
    };

    return newDevice;
}


const sanitizeExistingDevice = (deviceExis: Model, device: Model) => {
    if (deviceExis.SIM_number === device.SIM_number) {
        const error: HttpError.Model = {
            status: 409,
            message: 'SIM_number already exists',
        };
        throw error;
    }
    if (deviceExis.IMEI_1 === device.IMEI_1) {
        const error: HttpError.Model = {
            status: 409,
            message: 'IMEI_1 already exists',
        };
        throw error;
    }
    if (deviceExis.mehalcha_number === device.mehalcha_number) {
        const error: HttpError.Model = {
            status: 409,
            message: 'mehalcha_number already exists',
        };
        throw error;
    }
}

const sanitizeIdExisting = (id: any) => {
    if (!id.params.id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'No ID provided'
        };
        throw error;
    }
}

const sanitizeBodyExisting = (req: any) => {
    if (!req.body ||  Object.keys(req.body).length === 0) {
        const error: HttpError.Model = {
            status: 400,
            message: 'No body provaider'
        };
        throw error;
    }
}

export { Model, sanitize, sanitizeExistingDevice, sanitizeIdExisting, sanitizeBodyExisting }
