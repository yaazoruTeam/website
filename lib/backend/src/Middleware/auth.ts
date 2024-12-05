import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        const error: HttpError.Model = {
            status: 403,
            message: 'Access denied - missing token'
        }
        throw error;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            const error: HttpError.Model = {
                status: 403,
                message: 'Not authorized admin'
            }
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

const isBranch = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        const error: HttpError.Model = {
            status: 403,
            message: 'Access denied - missing token'
        }
        throw error;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'branch') {
            const error: HttpError.Model = {
                status: 403,
                message: 'Not authorized branch'
            }
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export { isAdmin, isBranch };
