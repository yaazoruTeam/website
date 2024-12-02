import { HttpError } from ".";

interface Model {
    customerDevice_id: string;
    customer_id: string;
    device_id: string;
}

function sanitize(customerDevice: Model, hasId: boolean): Model {
    const isString = (value: any) => typeof value === 'string';

    if (hasId && !customerDevice.customerDevice_id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "customerDevice_id".'
        };
        throw error;
    }
    if (!isString(customerDevice.customer_id) || customerDevice.customer_id.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "customer_id".'
        };
        throw error;
    }
    if (!isString(customerDevice.device_id) || customerDevice.device_id.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "device_id".'
        };
        throw error;
    }

    const newCustomerDevice: Model = {
        customerDevice_id: customerDevice.customerDevice_id,
        customer_id: customerDevice.customer_id,
        device_id: customerDevice.device_id
    };
    return newCustomerDevice;
}

const sanitizeExistingCustomerDevice = (customerDeviceExis: Model, customerDevice: Model) => {
    if (customerDeviceExis.device_id === customerDevice.device_id) {
        const error: HttpError.Model = {
            status: 409,
            message: 'device_id already exists',
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
    if (!req.body || Object.keys(req.body).length === 0) {
        const error: HttpError.Model = {
            status: 400,
            message: 'No body provaider'
        };
        throw error;
    }
}

export { Model, sanitize, sanitizeExistingCustomerDevice, sanitizeIdExisting, sanitizeBodyExisting }
