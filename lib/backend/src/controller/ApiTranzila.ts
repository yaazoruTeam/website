import { Request, Response, NextFunction } from 'express';
import { HttpError, User } from '../model';
import db from '../db';
import { generateToken, verifyToken } from '../utils/jwt';
import { comparePasswords } from '../utils/password';
import { createUser } from './user';
import { charge } from '../tranzila/Authentication';

const chargeTokenTranzila = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('charge11');
        const result = await charge();
        console.log('result after charge');
        console.log(result);
    } catch (error: any) {
        console.log('error in charge!!');
        next(error);
    }
};

export { chargeTokenTranzila };
