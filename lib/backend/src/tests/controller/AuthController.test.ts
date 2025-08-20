import { NextFunction, Request, Response } from 'express';
import { register, login, refreshToken } from '../../controller/AuthController';
import { createUser } from '../../controller/user';
import * as db from '../../db/index';
import { generateToken, verifyToken } from '../../utils/jwt';
import { comparePasswords } from '../../utils/password';

jest.mock('../../controller/user');
jest.mock('../../db/index');
jest.mock('../../utils/jwt');
jest.mock('../../utils/password');

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
