import { NextFunction, Response } from 'express';

const handleError = (res: Response, error: any): void => {
    console.error('Error:', error.message);
    if (error.status) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export default handleError;
