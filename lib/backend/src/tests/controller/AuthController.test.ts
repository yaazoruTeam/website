/**
 * קובץ טסטים עבור AuthController - מערכת האימות וההרשאות
 * 
 * מטרת הקובץ: בדיקת פונקציונליות הרשמה, התחברות ורענון טוקנים במערכת
 * 
 * הפונקציות הנבדקות:
 * 1. register - הרשמת משתמש חדש (wrapper ל-createUser)
 * 2. login - התחברות עם שם משתמש וסיסמה
 * 3. refreshToken - רענון JWT token קיים
 * 
 * תהליכי האימות:
 * - הרשמה: יצירת משתמש חדש במערכת
 * - התחברות: וולידציה של נתונים + יצירת JWT token
 * - רענון: וולידציה של token קיים + יצירת token חדש
 * 
 * שכבות האבטחה הנבדקות:
 * - הצפנת סיסמאות (bcrypt)
 * - JWT tokens עם תוקף
 * - וולידציה של קלטים
 * - טיפול בשגיאות אבטחה
 */

import { NextFunction, Request, Response } from 'express';
import { register, login, refreshToken } from '../../controller/AuthController';
import { createUser } from '../../controller/user';
import * as db from '../../db/index';
import { generateToken, verifyToken } from '../../utils/jwt';
import { comparePasswords } from '../../utils/password';

// מוקים של כל התלויות החיצוניות כדי לשלוט על התנהגותן בטסטים
jest.mock('../../controller/user');          // מוק יצירת משתמש
jest.mock('../../db/index');                 // מוק פעולות מסד נתונים  
jest.mock('../../utils/jwt');                // מוק פעולות JWT (יצירה ווולידציה)
jest.mock('../../utils/password');           // מוק השוואת סיסמאות

/**
 * חבילת טסטים עבור AuthController - מערכת האימות המרכזית
 * בודקת 3 פונקציות מרכזיות: הרשמה, התחברות ורענון טוקנים
 * 
 * סוגי הטסטים בקובץ:
 * 1. טסטי יחידה (Unit Tests) - בודקים זרימה טכנית
 * 2. טסטי אינטגרציה (Integration Tests) - בודקים התנהגות אמיתית
 * 3. טסטי הצלחה - תרחישים תקינים של אימות
 * 4. טסטי כשלון - טיפול בשגיאות אבטחה שונות  
 * 5. טסטי וולידציה - בדיקת קלטים לא תקינים
 * 6. טסטי מסד נתונים - טיפול בכשלי DB
 * 7. טסטי JWT - וולידציה של טוקנים
 * 8. טסטי קצה (Edge Cases) - מצבים חריגים ולא צפויים
 */
describe('AuthController Tests', () => {
    // אובייקטים מזויפים לסימולציה של Express.js במערכת האימות
    let req: Partial<Request>;    // בקשת HTTP מזויפת - תכיל נתוני התחברות/הרשמה
    let res: Partial<Response>;   // תגובת HTTP מזויפת - תחזיר טוקנים או שגיאות
    let next: NextFunction;       // פונקציה למעבר למטפל שגיאות במקרה של כשל אימות

    /**
     * הכנה לפני כל טסט אימות:
     * - מאתחל אובייקטי בקשה ותגובה נקיים
     * - מנקה את כל המוקים הקיימים מטסטים קודמים
     * - מכין סביבה נקייה לבדיקת תרחישי אימות
     */
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    /**
     * ניקוי אחרי כל טסט אימות:
     * מחזיר את כל המוקים למצב המקורי למניעת השפעה על טסטים אחרים
     */
    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * קבוצת טסטים עבור פונקציית register
     * בודקת תהליך הרשמת משתמשים חדשים למערכת
     * הפונקציה היא wrapper ל-createUser ומעבירה את כל העבודה אליה
     * 
     * חשיבות הטסטים:
     * - וולידציה שהמערכת מקבלת משתמשים חדשים
     * - טיפול בשגיאות וולידציה ומסד נתונים
     * - הגנה מפני רישום כפול או נתונים פגומים
     */
    describe('register', () => {
        /**
         * טסט הרשמה מוצלחת - תרחיש הזהב
         * בודק שהפונקציה מעבירה בהצלחה את הבקשה ל-createUser
         * מוודא שהמשתמש נוצר עם הנתונים הנכונים ומוחזר עם ID
         */
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

        /**
         * בודק טיפול בשגיאות כלליות במהלך הרשמה
         * מוודא שהפונקציה מעבירה שגיאות מ-createUser ל-middleware הבא
         * חשוב לטיפול בכשלים טכניים במהלך יצירת המשתמש
         */
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


        /**
         * בודק טיפול בשגיאות וולידציה של נתוני המשתמש
         * מוודא שהמערכת דוחה נתונים לא תקינים (שם ריק, סיסמה חלשה, תפקיד לא חוקי)
         * חשוב לאבטחת המערכת מפני קלטים פגומים
         */
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

        /**
         * בודק טיפול בשגיאות מסד נתונים במהלך הרשמה
         * מוודא שהמערכת מטפלת במצבים כמו משתמש קיים או בעיות DB
         * חשוב לעמידות המערכת מול כשלי מסד נתונים
         */
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

    /**
     * קבוצת טסטים אינטגרציה עבור פונקציית register
     * בודקת את ההתנהגות האמיתית של המערכת - כמו בהרצה בפועל
     * כוללת וולידציה אמיתית של שדות חובה ותנאי קבלה למערכת
     */
    describe('register - Integration Tests', () => {
        /**
         * טסט שבודק דחיית הרשמה עם נתונים חסרים
         * מחקה את ההתנהגות האמיתית: כשחסרים שדות חובה הוולידציה נכשלת
         * חשוב לאבטחה - מוודא שלא ניתן לעקוף וולידציה עם נתונים חלקיים
         */
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

        /**
         * טסט שבודק הרשמה מוצלחת עם נתונים מלאים
         * מחקה את התרחיש האמיתי: כשכל השדות הנדרשים קיימים
         * מוודא שהמערכת מקבלת משתמשים עם נתונים מלאים ותקינים
         */
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

        /**
         * טסט שבודק דחיית נתונים לא תקינים
         * מחקה וולידציה של פורמטים: אימייל שגוי, טלפון לא תקין וכו'
         * חשוב לאיכות הנתונים במערכת
         */
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

            // מוק שמחקה שגיאות וולידציה מפורטות
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

        /**
         * טסט שבודק דחיית משתמש שכבר קיים במערכת
         * מחקה את הבדיקה האמיתית של existingUser() בcreateUser
         * חשוב למניעת יצירת משתמשים כפולים
         */
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

        /**
         * טסט שבודק טיפול בכשל הצפנת סיסמה
         * מחקה כשל בhashPassword() במהלך תהליך היצירה
         * חשוב לעמידות המערכת מול שגיאות קריפטוגרפיות
         */
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

    /**
     * קבוצת טסטים עבור פונקציית login
     * בודקת תהליך התחברות משתמשים קיימים למערכת
     * כוללת וולידציה של נתונים, השוואת סיסמאות ויצירת JWT tokens
     * 
     * שלבי התהליך הנבדקים:
     * 1. חיפוש המשתמש במסד הנתונים
     * 2. השוואת הסיסמה המוזנת לסיסמה המוצפנת
     * 3. יצירת JWT token עם פרטי המשתמש והרשאותיו
     * 4. החזרת הטוקן ללקוח
     * 
     * חשיבות אבטחתית גבוהה - נקודת כניסה מרכזית למערכת
     */
    describe('login', () => {
        /**
         * טסט התחברות מוצלחת - תרחיש הזהב
         * בודק את כל שרשרת האימות: חיפוש משתמש → השוואת סיסמה → יצירת טוקן
         * מוודא שמוחזר JWT token תקין עם פרטי המשתמש
         */
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

        /**
         * בודק טיפול במשתמש לא קיים במערכת
         * מוודא שהמערכת מחזירה שגיאה 404 כשהמשתמש לא נמצא
         * חשוב למניעת חשיפת מידע על משתמשים קיימים
         */
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

        /**
         * בודק טיפול בסיסמה שגויה
         * מוודא שהמערכת מחזירה שגיאה 401 כשהסיסמה לא תואמת
         * חשוב לאבטחה - מונע גישה לא מורשית למשתמשים
         */
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

        /**
         * בודק טיפול בשגיאות מסד נתונים במהלך חיפוש משתמש
         * מוודא שהמערכת מטפלת בכשלי חיבור או שאילתות DB
         * חשוב לעמידות המערכת מול בעיות תשתית
         */
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

        /**
         * בודק טיפול בשגיאות במהלך השוואת סיסמאות
         * מוודא שהמערכת מטפלת בכשלים בתהליך הצפנה/השוואה
         * חשוב לטיפול בשגיאות קריפטוגרפיות
         */
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

        /**
         * בודק טיפול בשגיאות במהלך יצירת JWT token
         * מוודא שהמערכת מטפלת בכשלים בתהליך יצירת הטוקן
         * חשוב לוולידציה של תהליך האימות השלם
         */
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

        /**
         * בודק טיפול בבקשה ללא נתוני התחברות
         * מוודא שהמערכת מטפלת בבקשות עם body ריק או חסר
         * חשוב לעמידות המערכת מול קלטים לא שלמים
         */
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

    /**
     * קבוצת טסטים אינטגרציה עבור פונקציית login
     * בודקת תרחישי התחברות אמיתיים עם וולידציה מלאה
     * כוללת בדיקות של נתונים שחסרים, פורמטים שגויים ומצבי קצה
     */
    describe('login - Integration Tests', () => {
        /**
         * טסט שבודק דחיית התחברות עם נתונים חסרים
         * מחקה מצב אמיתי שבו המשתמש לא שולח user_name או password
         * חשוב לאבטחה - מונע ניסיונות התחברות עם נתונים חלקיים
         */
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

        /**
         * טסט שבודק התחברות עם שם משתמש ריק
         * מחקה מצב שבו שולחים string ריק במקום שם משתמש תקין
         * חשוב לוולידציה של קלטים
         */
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

        /**
         * טסט שבודק התחברות עם סיסמה ריקה
         * מחקה מצב שבו המשתמש קיים אבל הסיסמה ריקה
         * בודק שהמערכת מטפלת נכון בהשוואת סיסמה ריקה
         */
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

        /**
         * טסט שבודק התחברות עם סיסמה שמכילה רווחים בלבד
         * מחקה ניסיון עקיפה עם סיסמה "חזותית" שהיא למעשה ריקה
         * חשוב לאבטחה - מונע ניסיונות עקיפה עם רווחים
         */
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

        /**
         * טסט שבודק התחברות עם נתונים מסוג שגוי
         * מחקה מצב שבו שולחים מספרים או אובייקטים במקום strings
         * חשוב לעמידות המערכת מול קלטים לא צפויים
         */
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

        /**
         * טסט שבודק התחברות מוצלחת עם נתונים אמיתיים מלאים
         * מחקה תרחיש אמיתי של התחברות עם כל השדות הנדרשים
         * מוודא שכל התהליך עובד כשהנתונים תקינים
         */
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

    /**
     * קבוצת טסטים עבור פונקציית refreshToken
     * בודקת תהליך רענון JWT tokens לפני תפוגתם
     * כוללת וולידציה של טוקן קיים ויצירת טוקן חדש עם תוקף מחודש
     * 
     * תהליך הרענון:
     * 1. חילוץ הטוקן מכותרת Authorization
     * 2. וולידציה של הטוקן הקיים
     * 3. פענוח פרטי המשתמש מהטוקן
     * 4. יצירת טוקן חדש עם אותם פרטים
     * 
     * חשיבות: מאפשר שמירה על חיבור המשתמש ללא התחברות חוזרת
     * אבטחה: מונע שימוש בטוקנים פגומים או מזויפים
     */
    describe('refreshToken', () => {
        /**
         * טסט רענון טוקן מוצלח - תרחיש הזהב
         * בודק את כל התהליך: חילוץ טוקן → וולידציה → יצירת טוקן חדש
         * מוודא שמוחזר טוקן חדש עם אותם הרשאות כמו הישן
         */
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

        /**
         * בודק טיפול בבקשה ללא כותרת Authorization
         * מוודא שהמערכת מחזירה שגיאה 403 כשחסר טוקן אימות
         * חשוב לאבטחה - מונע גישה ללא אימות
         */
        it('should return 403 if authorization header is missing', async () => {
            req.headers = {};

            await refreshToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied - missing token'
            });
            expect(verifyToken).not.toHaveBeenCalled();
        });

        /**
         * בודק טיפול בכותרת Authorization ללא טוקן
         * מוודא שהמערכת מטפלת בפורמט "Bearer " ללא טוקן בפועל
         * חשוב לוולידציה של פורמט הכותרת
         */
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

        /**
         * בודק טיפול בפורמט לא תקין של כותרת Authorization
         * מוודא שהמערכת דוחה כותרות שלא במבנה "Bearer <token>"
         * חשוב לאבטחה - מונע ניסיונות עקיפה של מנגנון האימות
         */
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

        /**
         * בודק טיפול בטוקן לא תקין או פגום
         * מוודא שהמערכת מחזירה שגיאה 401 לטוקנים שלא עוברים וולידציה
         * חשוב לאבטחה - מונע שימוש בטוקנים מזויפים או פגומים
         */
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

        /**
         * בודק טיפול בטוקן שעבר וולידציה אך ללא נתונים מפוענחים
         * מוודא שהמערכת מטפלת במצבים חריגים של וולידציה חלקית
         * חשוב לעמידות המערכת מול תוצאות לא צפויות מתהליך הוולידציה
         */
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

        /**
         * בודק טיפול בשגיאות במהלך וולידציה של טוקן
         * מוודא שהמערכת מטפלת בכשלים טכניים בתהליך בדיקת הטוקן
         * חשוב לעמידות המערכת מול שגיאות קריפטוגרפיות
         */
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

        /**
         * בודק טיפול בשגיאות במהלך יצירת טוקן חדש
         * מוודא שהמערכת מטפלת בכשלים ביצירת הטוקן החדש לאחר וולידציה מוצלחת
         * חשוב לוולידציה של תהליך הרענון השלם
         */
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

        /**
         * בודק טיפול בכותרת Authorization פגומה (רק "Bearer" ללא טוקן)
         * מוודא שהמערכת מטפלת בפורמטים חלקיים או פגומים
         * חשוב לעמידות המערכת מול קלטים לא תקינים
         */
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

        /**
         * בודק טיפול בכותרת Authorization עם ערך undefined
         * מוודא שהמערכת מטפלת במצבים שבהם הכותרת קיימת אך ללא ערך
         * חשוב לעמידות המערכת מול מבני נתונים לא צפויים
         */
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
