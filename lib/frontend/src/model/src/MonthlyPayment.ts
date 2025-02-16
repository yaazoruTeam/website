import { HttpError } from ".";

interface Model {
    monthlyPayment_id: string;
    customer_id: string;
    start_date: Date;
    total_amount: number;
    status: 'active' | 'inactive';
    frequency: string;
    next_charge: Date;
    last_attempt: Date;
    last_sucsse: Date;
    created_at: Date;
    update_at: Date;
}

function sanitize(monthlyPayment: Model, hasId: boolean): Model {
    if (hasId && !monthlyPayment.monthlyPayment_id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "monthlyPayment_id".',
        };
        throw error;
    }
    if (!monthlyPayment.customer_id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "customer_id".',
        };
        throw error;
    }
    if (!monthlyPayment.start_date) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "start_date".',
        };
        throw error;
    }
    if (!monthlyPayment.total_amount) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "total_amount".',
        };
        throw error;
    }
    if (!monthlyPayment.frequency) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "frequency".',
        };
        throw error;
    }
    if (!monthlyPayment.next_charge) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "next_charge".',
        };
        throw error;
    }
    if (!monthlyPayment.last_attempt) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "last_attempt".',
        };
        throw error;
    }
    if (!monthlyPayment.last_sucsse) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "last_sucsse".',
        };
        throw error;
    }
    if (!monthlyPayment.created_at) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "created_at".',
        };
        throw error;
    }
    if (!monthlyPayment.update_at) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "update_at".',
        };
        throw error;
    }
    const newMonthlyPayment: Model = {
        monthlyPayment_id: monthlyPayment.monthlyPayment_id,
        customer_id: monthlyPayment.customer_id,
        start_date: monthlyPayment.start_date,
        total_amount: monthlyPayment.total_amount,
        status: monthlyPayment.status || 'active',
        frequency: monthlyPayment.frequency,
        next_charge: monthlyPayment.next_charge,
        last_attempt: monthlyPayment.last_attempt,
        last_sucsse: monthlyPayment.last_sucsse,
        created_at: monthlyPayment.created_at,
        update_at: monthlyPayment.update_at,
    };
    return newMonthlyPayment;
}

const sanitizeIdExisting = (id: any) => {
    if (!id.params.id) {
        const error: HttpError.Model = {
            status: 400,
            message: "No ID provided",
        };
        throw error;
    }
};

const sanitizeBodyExisting = (req: any) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        const error: HttpError.Model = {
            status: 400,
            message: "No body provaider",
        };
        throw error;
    }
};

export type { Model };
export {
    sanitize,
    sanitizeIdExisting,
    sanitizeBodyExisting,
};
