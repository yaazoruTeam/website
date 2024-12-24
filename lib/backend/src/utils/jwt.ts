import { JwtPayload } from '@yaazoru/model';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (userId: string, role: string): string => {
    const payload = { user_id: userId, role: role };
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};

const verifyToken = (token: string): { valid: boolean; decoded?: JwtPayload.Model } => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload.Model;
        return { valid: true, decoded };
    } catch (error: any) {        
        return { valid: false };
    }
};

export { generateToken, verifyToken }
