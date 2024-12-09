import { Request, Response, NextFunction } from 'express';
import { HttpError, User } from '@yaazoru/model';
import db from '../db';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
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
        const accessToken = generateToken(user.user_id, user.role);
        const refreshToken = generateRefreshToken({ userId: user.user_id, role: user.role });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
        next(error);
    }
};

const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        const error: HttpError.Model = {
            status: 403,
            message: 'Refresh token is required'
        }
    }
    try {
        const decoded = verifyToken(refreshToken);
        const newAccessToken = generateToken(decoded.userId, decoded.role);
        const newRefreshToken = generateRefreshToken({ userId: decoded.userId, role: decoded.role });
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        next(error);
    }
};


export { register, login, refreshToken };
