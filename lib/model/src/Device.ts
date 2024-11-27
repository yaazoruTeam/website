interface Model {
    device_id: string;
    SIM_number: number;
    IMEI_1: number;
    mehalcha_number: number;
    model: string;
}


function sanitize(device: Model, hasId: boolean): Model {
    const isString = (value: any) => typeof value === 'string';

    if (hasId && (!device.device_id || !isString(device.device_id) || device.device_id.trim() === ''))
        throw {
            status: 400,
            message: 'Invalid or missing "id".'
        };

    if (!device.SIM_number)
        throw {
            status: 400,
            message: 'Invalid or missing "SIM_number".'
        };
    if (!device.IMEI_1)
        throw {
            status: 400,
            message: 'Invalid or missing "IMEI_1".'
        };
    if (!device.mehalcha_number)
        throw {
            status: 400,
            message: 'Invalid or missing "mehalcha_number".'
        };
    if (!device.model)
        throw {
            status: 400,
            message: 'Invalid or missing "model".'
        };


    const newDevice: Model = {
        device_id: device.device_id,
        SIM_number: device.SIM_number,
        IMEI_1: device.IMEI_1,
        mehalcha_number: device.mehalcha_number,
        model: device.model,
    };

    return newDevice;
}

export { Model, sanitize }
