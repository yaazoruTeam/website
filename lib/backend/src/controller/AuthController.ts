import { Request, Response, NextFunction } from 'express';
import { HttpError, User } from '@yaazoru/model';
import db from '../db';
import { generateToken } from '../utils/jwt';
import { comparePasswords } from '../utils/password';
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
        const token = generateToken(user.user_id, user.role);
        res.status(200).json({ token });
    } catch (error: any) {
        next(error);
    }
};

export { register, login };
