import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError, User } from '../model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const hasRole = (...roles: Array<User.Model['role']>) => {
    console.log('has role', roles);

    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            const error: HttpError.Model = {
                status: 403,
                message: 'Access denied - missing token',
            };
            return next(error);
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);

            if (!roles.includes(decoded.role)) {
                const error: HttpError.Model = {
                    status: 403,
                    message: `Access denied - role '${decoded.role}' not authorized`,
                };
                return next(error);
            }

            next();
        } catch (error) {
            const err: HttpError.Model = {
                status: 401,
                message: 'Invalid or expired token',
            };
            return next(err);
        }
    };
};

export { hasRole };
