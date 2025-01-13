import { HttpError } from ".";

interface Model {
    user_id: string;
    first_name: string;
    last_name: string;
    id_number: string;
    phone_number: string;
    additional_phone: string;
    email: string;
    city: string;
    address1: string;
    address2: string;
    zipCode: string;
    password: string;
    user_name: string;
    role: 'admin' | 'branch';
    status: string;
}

function sanitize(user: Model, hasId: boolean): Model {
    const isString = (value: any) => typeof value === 'string';
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhoneNumber = (phone: string) =>
        /^\d{9,15}$/.test(phone);

    if (hasId && !user.user_id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "user_id".'
        };
        throw error;
    }
    if (!isString(user.first_name) || user.first_name.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "first_name".'
        };
        throw error;
    }
    if (!isString(user.last_name) || user.last_name.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "last_name".'
        };
        throw error;
    }
    if (!isString(user.id_number) || user.id_number.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "id_number".'
        };
        throw error;
    }
    if (!isString(user.phone_number) || !isValidPhoneNumber(user.phone_number)) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "phone_number". It must be a number between 9 and 15 digits.'
        };
        throw error;
    }
    if (user.additional_phone && (!isString(user.additional_phone) || !isValidPhoneNumber(user.additional_phone))) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.'
        };
        throw error;
    }
    if (!isString(user.email) || !isValidEmail(user.email)) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "email".'
        };
        throw error;
    }
    if (!isString(user.city) || user.city.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "city".'
        };
        throw error;
    }
    if (!isString(user.address1) || user.address1.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "address1".'
        };
        throw error;
    }
    if (user.address2 && !isString(user.address2)) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "address2".'
        };
        throw error;
    }
    if (!isString(user.zipCode) || user.zipCode.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "zipCode".'
        };
        throw error;
    }
    if (!isString(user.password) || user.password.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "password".'
        };
        throw error;
    }
    if (!isString(user.user_name) || user.user_name.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "user_name".'
        };
        throw error;
    }
    if (!isString(user.role) || user.role.trim() === '') {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "role".'
        };
        throw error;
    }
    const newUser: Model = {
        user_id: user.user_id,
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        id_number: user.id_number.trim(),
        phone_number: user.phone_number.trim(),
        additional_phone: user.additional_phone,
        email: user.email.trim().toLowerCase(),
        city: user.city.trim(),
        address1: user.address1.trim(),
        address2: user.address2,
        zipCode: user.zipCode,
        password: user.password,
        user_name: user.user_name,
        role: user.role,
        status: user.status || 'active',
    };
    return newUser;
}

const sanitizeExistingUser = (userExis: Model, user: Model) => {
    if (userExis.id_number === user.id_number) {
        const error: HttpError.Model = {
            status: 409,
            message: 'id_number already exists',
        };
        throw error;
    }
    if (userExis.email === user.email) {
        const error: HttpError.Model = {
            status: 409,
            message: 'email already exists',
        };
        throw error;
    }
    if (userExis.password === user.password) {
        const error: HttpError.Model = {
            status: 409,
            message: 'password already exists',
        };
        throw error;
    }
    if (userExis.user_name === user.user_name) {
        const error: HttpError.Model = {
            status: 409,
            message: 'user_name already exists',
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

export type { Model };
export { sanitize, sanitizeExistingUser, sanitizeIdExisting, sanitizeBodyExisting };
