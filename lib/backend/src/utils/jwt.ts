import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const generateToken = (userId: string, role: string): string => {
    const payload = { user_id: userId, role: role };
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
