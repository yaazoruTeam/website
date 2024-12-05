import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const generateToken = (userId: string, role: string): string => {
    console.log(JWT_SECRET);
    
    const payload = { user_id: userId, role: role };
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};
