import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // מפתח סודי

// פונקציה ליצירת JWT
export const generateToken = (userId: string): string => {
    const payload = { user_id: userId };
    const options = { expiresIn: '1h' }; // אורך זמן תקף של הטוקן (לדוגמה, שעה אחת)

    // חתימה ויצירת ה-token
    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
};
