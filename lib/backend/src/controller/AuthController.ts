import { Request, Response, NextFunction } from 'express';
import { HttpError, User } from '@/model/src';
import * as db from '@/db';
import { generateToken, verifyToken } from '@/utils/jwt';
import { comparePasswords } from '@/utils/password';
import { createUser } from './user';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await createUser(req, res, next);
    } catch (error: any) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { user_name, password } = req.body;
        const user: User.Model = await db.User.findUser({ user_name });
        if (!user) {
            const error: HttpError.Model = {
                status: 404,
                message: 'User not found',
            };
            throw error;
        }
        const isPasswordCorrect = await comparePasswords(password, user.password);
        if (!isPasswordCorrect) {
            const error: HttpError.Model = {
                status: 401,
                message: 'Incorrect password',
            };
            throw error;
        }
        const accessToken = generateToken(user.user_id, user.role);

        res.status(200).json(accessToken);
    } catch (error: any) {
        next(error);
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            const error: HttpError.Model = {
                status: 403,
                message: 'Access denied - missing token',
            };
            throw error;
        }

        const { valid, decoded } = verifyToken(token);
        if (valid && decoded) {
            const { user_id, role } = decoded;
            const newAccessToken = generateToken(user_id, role);
            res.status(200).json(newAccessToken);
        } else {
            const error: HttpError.Model = {
                status: 401,
                message: 'Invalid token',
            };
            throw error;
        }
    } catch (error: any) {
        next(error);
    }
};

export { register, login, refreshToken };
