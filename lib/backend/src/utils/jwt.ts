import { JwtPayload } from '@yaazoru/model';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (userId: string, role: string): string => {
    const payload = { user_id: userId, role: role };
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};

const verifyToken = (token: string): { valid: boolean; expired: boolean; decoded?: JwtPayload.Model } => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload.Model;
        return { valid: true, expired: false, decoded };
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, expired: true, decoded: jwt.decode(token) as JwtPayload.Model };
        }
        return { valid: false, expired: false };
    }
};

export { generateToken, verifyToken }
