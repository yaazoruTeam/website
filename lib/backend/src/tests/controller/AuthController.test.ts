import { NextFunction, Request, Response } from 'express';
import { register, login, refreshToken } from '../../controller/AuthController';
import { createUser } from '../../controller/user';
import * as db from '../../db/index';
import { generateToken, verifyToken } from '../../utils/jwt';
import { comparePasswords } from '../../utils/password';

jest.mock('../../controller/user')
jest.mock('../../db/index')
jest.mock('../../utils/jwt')
jest.mock('../../utils/password')

describe('AuthController Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                user_name: 'testuser',
                password: 'testpassword',
                role: 'user'
            };
            req.body = userData;

            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                res.status(201).json({ user_id: 1, ...userData });
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
        });

        it('should handle errors during user registration', async () => {
            const userData = {
                user_name: 'testuser',
                password: 'testpassword',
                role: 'user'
            };
            req.body = userData;

            const registrationError = new Error('Registration failed');
            (createUser as jest.Mock).mockImplementation(() => {
                throw registrationError;
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).toHaveBeenCalledWith(registrationError);
        });

        it('should handle validation errors from createUser', async () => {
            const userData = {
                user_name: '',
                password: 'weak',
                role: 'invalid'
            };
            req.body = userData;

            const validationError = {
                status: 400,
                message: 'Invalid user data'
            };
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                next(validationError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
        });

        it('should handle database errors during registration', async () => {
            const userData = {
                user_name: 'existinguser',
                password: 'testpassword',
                role: 'user'
            };
            req.body = userData;

            const dbError = {
                status: 409,
                message: 'User already exists'
            };
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                next(dbError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
        });
    });

    describe('register - Integration Tests', () => {
        it('should reject registration with missing required fields', async () => {
            const incompleteData = {
                user_name: 'testuser',
                password: 'testpassword',
                role: 'user'
                // חסרים שדות חובה: email, first_name, last_name, id_number וכו'
            };
            req.body = incompleteData;

            // מוק שמחקה את שגיאת הוולידציה האמיתית של User.sanitize()
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                const validationError = {
                    status: 400,
                    message: 'Missing required fields: email, first_name, last_name, id_number'
                };
                next(validationError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).toHaveBeenCalledWith({
                status: 400,
                message: 'Missing required fields: email, first_name, last_name, id_number'
            });
        });

        it('should register successfully with complete user data', async () => {
            const completeUserData = {
                user_name: 'testuser',
                password: 'strongPassword123!',
                role: 'user',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                id_number: '123456789',
                phone: '0501234567',
                address: 'Test Address 123'
            };
            req.body = completeUserData;

            const createdUser = {
                user_id: 1,
                ...completeUserData,
                password: 'hashedPassword', // הסיסמה מוצפנת
                created_at: new Date(),
                updated_at: new Date()
            };

            // מוק שמחקה יצירה מוצלחת עם נתונים מלאים
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                res.status(201).json(createdUser);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).not.toHaveBeenCalled(); // לא צריכה להיות שגיאה
        });

        it('should reject registration with invalid data formats', async () => {
            const invalidData = {
                user_name: 'tu', // קצר מדי
                password: '123', // חלש מדי
                role: 'invalid_role', // תפקיד לא קיים
                email: 'not-an-email', // פורמט אימייל שגוי
                first_name: '', // שם ריק
                last_name: 'U', // שם קצר מדי
                id_number: '123', // תעודת זהות קצרה מדי
                phone: 'not-a-phone' // טלפון לא תקין
            };
            req.body = invalidData;

            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                const validationError = {
                    status: 400,
                    message: 'Validation failed: Invalid email format, password too weak, invalid role, phone number invalid'
                };
                next(validationError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).toHaveBeenCalledWith({
                status: 400,
                message: expect.stringContaining('Validation failed')
            });
        });

        it('should reject registration when user already exists', async () => {
            const existingUserData = {
                user_name: 'existinguser',
                password: 'testpassword123!',
                role: 'user',
                email: 'existing@example.com',
                first_name: 'Existing',
                last_name: 'User',
                id_number: '987654321',
                phone: '0509876543'
            };
            req.body = existingUserData;

            // מוק שמחקה שגיאת משתמש קיים מexistingUser()
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                const duplicateError = {
                    status: 409,
                    message: 'User already exists with this email or username'
                };
                next(duplicateError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).toHaveBeenCalledWith({
                status: 409,
                message: 'User already exists with this email or username'
            });
        });

        it('should handle password hashing errors during registration', async () => {
            const userData = {
                user_name: 'testuser',
                password: 'validPassword123!',
                role: 'user',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                id_number: '123456789'
            };
            req.body = userData;

            // מוק שמחקה שגיאה בהצפנת סיסמה
            (createUser as jest.Mock).mockImplementation((req, res, next) => {
                const hashError = new Error('Password hashing failed');
                next(hashError);
            });

            await register(req as Request, res as Response, next);

            expect(createUser).toHaveBeenCalledWith(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('login', () => {
        it('should login user successfully with valid credentials', async () => {
            const loginData = {
                user_name: 'testuser',
                password: 'testpassword'
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'testuser',
                password: 'hashedpassword',
                role: 'user'
            };

            const mockToken = {
                accessToken: 'jwt.token.here',
                expiresIn: '1h'
            };

            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue(mockToken);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'testuser' });
            expect(comparePasswords).toHaveBeenCalledWith('testpassword', 'hashedpassword');
            expect(generateToken).toHaveBeenCalledWith(1, 'user');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockToken);
        });

        it('should return 404 if user not found', async () => {
            const loginData = {
                user_name: 'nonexistentuser',
                password: 'testpassword'
            };
            req.body = loginData;

            (db.User.findUser as jest.Mock).mockResolvedValue(null);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'nonexistentuser' });
            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'User not found'
            });
            expect(comparePasswords).not.toHaveBeenCalled();
            expect(generateToken).not.toHaveBeenCalled();
        });

        it('should return 401 if password is incorrect', async () => {
            const loginData = {
                user_name: 'testuser',
                password: 'wrongpassword'
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'testuser',
                password: 'hashedpassword',
                role: 'user'
            };

            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(false);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'testuser' });
            expect(comparePasswords).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(next).toHaveBeenCalledWith({
                status: 401,
                message: 'Incorrect password'
            });
            expect(generateToken).not.toHaveBeenCalled();
        });

        it('should handle database errors during user lookup', async () => {
            const loginData = {
                user_name: 'testuser',
                password: 'testpassword'
            };
            req.body = loginData;

            const dbError = new Error('Database connection failed');
            (db.User.findUser as jest.Mock).mockRejectedValue(dbError);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'testuser' });
            expect(next).toHaveBeenCalledWith(dbError);
            expect(comparePasswords).not.toHaveBeenCalled();
        });

        it('should handle password comparison errors', async () => {
            const loginData = {
                user_name: 'testuser',
                password: 'testpassword'
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'testuser',
                password: 'hashedpassword',
                role: 'user'
            };

            const passwordError = new Error('Password comparison failed');
            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockRejectedValue(passwordError);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'testuser' });
            expect(comparePasswords).toHaveBeenCalledWith('testpassword', 'hashedpassword');
            expect(next).toHaveBeenCalledWith(passwordError);
        });

        it('should handle token generation errors', async () => {
            const loginData = {
                user_name: 'testuser',
                password: 'testpassword'
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'testuser',
                password: 'hashedpassword',
                role: 'user'
            };

            const tokenError = new Error('Token generation failed');
            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockImplementation(() => {
                throw tokenError;
            });

            await login(req as Request, res as Response, next);

            expect(generateToken).toHaveBeenCalledWith(1, 'user');
            expect(next).toHaveBeenCalledWith(tokenError);
        });

        it('should handle missing login credentials', async () => {
            req.body = {};

            const mockUser = undefined;
            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: undefined });
            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'User not found'
            });
        });
    });

    describe('login - Integration Tests', () => {
        it('should reject login with completely missing credentials', async () => {
            req.body = {}; // בקשה ריקה לגמרי

            await login(req as Request, res as Response, next);

            // המערכת תנסה לחפש משתמש עם undefined ותמצא null
            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: undefined });
            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'User not found'
            });
            expect(comparePasswords).not.toHaveBeenCalled();
        });

        it('should reject login with empty username', async () => {
            const loginData = {
                user_name: '', // שם משתמש ריק
                password: 'validpassword'
            };
            req.body = loginData;

            (db.User.findUser as jest.Mock).mockResolvedValue(null);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: '' });
            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'User not found'
            });
        });

        it('should reject login with empty password', async () => {
            const loginData = {
                user_name: 'validuser',
                password: '' // סיסמה ריקה
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'validuser',
                password: 'hashedpassword',
                role: 'user'
            };

            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(false); // סיסמה ריקה לא תתאמת

            await login(req as Request, res as Response, next);

            expect(comparePasswords).toHaveBeenCalledWith('', 'hashedpassword');
            expect(next).toHaveBeenCalledWith({
                status: 401,
                message: 'Incorrect password'
            });
        });

        it('should reject login with whitespace-only password', async () => {
            const loginData = {
                user_name: 'validuser',
                password: '   ' // רק רווחים
            };
            req.body = loginData;

            const mockUser = {
                user_id: 1,
                user_name: 'validuser',
                password: 'hashedpassword',
                role: 'user'
            };

            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(false);

            await login(req as Request, res as Response, next);

            expect(comparePasswords).toHaveBeenCalledWith('   ', 'hashedpassword');
            expect(next).toHaveBeenCalledWith({
                status: 401,
                message: 'Incorrect password'
            });
        });

        it('should handle login with non-string credentials', async () => {
            const loginData = {
                user_name: 123, // מספר במקום string
                password: { some: 'object' } // אובייקט במקום string
            };
            req.body = loginData;

            // המערכת תנסה לחפש עם הערכים הלא תקינים
            (db.User.findUser as jest.Mock).mockResolvedValue(null);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 123 });
            expect(next).toHaveBeenCalledWith({
                status: 404,
                message: 'User not found'
            });
        });

        it('should login successfully with realistic user data', async () => {
            const loginData = {
                user_name: 'real.user@company.com',
                password: 'MySecurePassword123!'
            };
            req.body = loginData;

            const mockUser = {
                user_id: 42,
                user_name: 'real.user@company.com',
                password: '$2b$10$hashedPasswordExample',
                role: 'admin',
                email: 'real.user@company.com',
                first_name: 'Real',
                last_name: 'User',
                created_at: new Date('2024-01-01'),
                updated_at: new Date()
            };

            const mockToken = {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                tokenType: 'Bearer',
                expiresIn: 3600,
                refreshToken: 'refresh_token_example'
            };

            (db.User.findUser as jest.Mock).mockResolvedValue(mockUser);
            (comparePasswords as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue(mockToken);

            await login(req as Request, res as Response, next);

            expect(db.User.findUser).toHaveBeenCalledWith({ user_name: 'real.user@company.com' });
            expect(comparePasswords).toHaveBeenCalledWith('MySecurePassword123!', '$2b$10$hashedPasswordExample');
            expect(generateToken).toHaveBeenCalledWith(42, 'admin');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockToken);
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully with valid token', async () => {
            const mockToken = 'valid.jwt.token';
            req.headers = {
                authorization: `Bearer ${mockToken}`
            };

            const mockDecoded = {
                user_id: 1,
                role: 'user'
            };

            const mockNewToken = {
                accessToken: 'new.jwt.token',
                expiresIn: '1h'
            };

            (verifyToken as jest.Mock).mockReturnValue({
                valid: true,
                decoded: mockDecoded
            });
            (generateToken as jest.Mock).mockReturnValue(mockNewToken);

            await refreshToken(req as Request, res as Response, next);

            expect(verifyToken).toHaveBeenCalledWith(mockToken);
            expect(generateToken).toHaveBeenCalledWith(1, 'user');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockNewToken);
        });

        it('should return 403 if authorization header is missing', async () => {
            req.headers = {};

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
            expect(verifyToken).not.toHaveBeenCalled();
        });

        it('should return 403 if token is missing from authorization header', async () => {
            req.headers = {
                authorization: 'Bearer '
            };

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
            expect(verifyToken).not.toHaveBeenCalled();
        });

        it('should return 403 if authorization header format is invalid', async () => {
            req.headers = {
                authorization: 'InvalidFormat'
            };

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
            expect(verifyToken).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', async () => {
            const mockToken = 'invalid.jwt.token';
            req.headers = {
                authorization: `Bearer ${mockToken}`
            };

            (verifyToken as jest.Mock).mockReturnValue({
                valid: false,
                decoded: null
            });

            await refreshToken(req as Request, res as Response, next);

            expect(verifyToken).toHaveBeenCalledWith(mockToken);
            expect(next).toHaveBeenCalledWith({
                status: 401,
                message: 'Invalid token'
            });
            expect(generateToken).not.toHaveBeenCalled();
        });

        it('should return 401 if token verification returns no decoded data', async () => {
            const mockToken = 'expired.jwt.token';
            req.headers = {
                authorization: `Bearer ${mockToken}`
            };

            (verifyToken as jest.Mock).mockReturnValue({
                valid: true,
                decoded: null
            });

            await refreshToken(req as Request, res as Response, next);

            expect(verifyToken).toHaveBeenCalledWith(mockToken);
            expect(next).toHaveBeenCalledWith({
                status: 401,
                message: 'Invalid token'
            });
            expect(generateToken).not.toHaveBeenCalled();
        });

        it('should handle token verification errors', async () => {
            const mockToken = 'valid.jwt.token';
            req.headers = {
                authorization: `Bearer ${mockToken}`
            };

            const verificationError = new Error('Token verification failed');
            (verifyToken as jest.Mock).mockImplementation(() => {
                throw verificationError;
            });

            await refreshToken(req as Request, res as Response, next);

            expect(verifyToken).toHaveBeenCalledWith(mockToken);
            expect(next).toHaveBeenCalledWith(verificationError);
        });

        it('should handle new token generation errors during refresh', async () => {
            const mockToken = 'valid.jwt.token';
            req.headers = {
                authorization: `Bearer ${mockToken}`
            };

            const mockDecoded = {
                user_id: 1,
                role: 'user'
            };

            const tokenGenerationError = new Error('New token generation failed');
            (verifyToken as jest.Mock).mockReturnValue({
                valid: true,
                decoded: mockDecoded
            });
            (generateToken as jest.Mock).mockImplementation(() => {
                throw tokenGenerationError;
            });

            await refreshToken(req as Request, res as Response, next);

            expect(verifyToken).toHaveBeenCalledWith(mockToken);
            expect(generateToken).toHaveBeenCalledWith(1, 'user');
            expect(next).toHaveBeenCalledWith(tokenGenerationError);
        });

        it('should handle malformed authorization header', async () => {
            req.headers = {
                authorization: 'Bearer'
            };

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
        });

        it('should handle undefined authorization header value', async () => {
            req.headers = {
                authorization: undefined
            };

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
        });
    });
});
