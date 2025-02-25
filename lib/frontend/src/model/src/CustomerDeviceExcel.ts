import { Device, HttpError } from ".";

interface Model {
    first_name: string;
    last_name: string;
    id_number: string;
    phone_number: string;
    additional_phone: string;
    email: string;
    city: string;
    address1: string;

    device_number: string;
    SIM_number: string;
    IMEI_1: string;
    mehalcha_number: string;
    model: string;

    date: number;
}

function sanitize(customerDeviceExcel: Model, isCustomer: boolean): Model {
    // const isString = (value: any) => typeof value === 'string';
    // const isValidEmail = (email: string) =>
    //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // const isValidPhoneNumber = (phone: string) =>
    //     /^\d{9,15}$/.test(phone);
    console.log('--------------------------------------------------------');

    if (isCustomer) {
        if (!customerDeviceExcel.first_name) {
            console.log('i failed in first name: ', customerDeviceExcel.first_name);

            const error: HttpError.Model = {
                status: 400,
                message: `Invalid or missing "first_name":  ${customerDeviceExcel.first_name}.`
            };
            throw error;
        }

        if (!customerDeviceExcel.last_name) {
            console.log('i failed in last name: ', customerDeviceExcel.last_name);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "last_name".'
            };
            throw error;
        }

        if (!customerDeviceExcel.id_number || !/^\d{8,9}$/.test(customerDeviceExcel.id_number)) {
            console.log('i failed in id number: ', customerDeviceExcel.id_number);

            const error: HttpError.Model = {
                status: 400,
                message: `Invalid or missing "id_number": ${customerDeviceExcel.id_number}.`
            };
            throw error;
        }
        if (!customerDeviceExcel.phone_number) {
            console.log('i failed in phone number: ', customerDeviceExcel.phone_number);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.'
            };
            throw error;
        }
        if (!customerDeviceExcel.email) {
            console.log('i failed in email: ', customerDeviceExcel.email);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "email".'
            };
            throw error;
        }

        if (!customerDeviceExcel.city) {
            console.log('i failed in city: ', customerDeviceExcel.city);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "city".'
            };
            throw error;
        }

        if (!customerDeviceExcel.address1) {
            console.log('i failed in address1: ', customerDeviceExcel.address1);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "address1".'
            };
            throw error;
        }

        if (!customerDeviceExcel.date) {
            console.log('i failed in date: ', customerDeviceExcel.date);

            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid or missing "date".'
            };
            throw error;
        }
    }

    if (!customerDeviceExcel.SIM_number) {
        console.log('i failed in sim number: ', customerDeviceExcel.SIM_number);

        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "SIM_number".'
        };
        throw error;
    }

    if (!customerDeviceExcel.IMEI_1) {
        console.log('i failed in IMEI 1', customerDeviceExcel.IMEI_1);

        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "IMEI_1".'
        };
        throw error;
    }

    if (!customerDeviceExcel.mehalcha_number) {
        console.log('i failed in mehalcha number: ', customerDeviceExcel.mehalcha_number);

        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "mehalcha_number".'
        };
        throw error;
    }

    if (!customerDeviceExcel.model) {
        console.log('i failed in model: ', customerDeviceExcel.model);

        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "model".'
        };
        throw error;
    }

    if (!customerDeviceExcel.device_number) {
        console.log('i failed in device number: ', customerDeviceExcel.device_number);

        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "device_number".'
        };
        throw error;

    }


    if (isCustomer) {
        const newCustomerDeviceExcel: Model = {
            first_name: customerDeviceExcel.first_name,
            last_name: customerDeviceExcel.last_name,
            id_number: customerDeviceExcel.id_number,
            phone_number: customerDeviceExcel.phone_number,
            additional_phone: customerDeviceExcel.additional_phone,
            email: customerDeviceExcel.email.trim().toLowerCase(),
            city: customerDeviceExcel.city,
            address1: customerDeviceExcel.address1,
            device_number: customerDeviceExcel.device_number,
            IMEI_1: customerDeviceExcel.IMEI_1,
            SIM_number: customerDeviceExcel.SIM_number,
            mehalcha_number: customerDeviceExcel.mehalcha_number,
            model: customerDeviceExcel.model,
            date: customerDeviceExcel.date,
        };
        return newCustomerDeviceExcel;

    } else {
        const newCustomerDeviceExcel: Model = {
            first_name: '',
            last_name: '',
            id_number: '',
            phone_number: '',
            additional_phone: '',
            email: '',
            city: '',
            address1: '',
            device_number: customerDeviceExcel.device_number,
            IMEI_1: customerDeviceExcel.IMEI_1,
            SIM_number: customerDeviceExcel.SIM_number,
            mehalcha_number: customerDeviceExcel.mehalcha_number,
            model: customerDeviceExcel.model,
            date: 0,
        };
        return newCustomerDeviceExcel;
    }
}

export type { Model }
export { sanitize }
