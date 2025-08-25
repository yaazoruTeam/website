/**
 * קובץ טסטים עבור ApiTranzila Controller
 * 
 * מטרת הקובץ: בדיקת פונקציונליות חיוב כרטיסי אשראי דרך Tranzila API
 * 
 * הפונקציה הנבדקת - chargeTokenTranzila:
 * - מקבלת בקשת HTTP עם כל תוכן שהוא
 * - מתעלמת מתוכן הבקשה ומשתמשת תמיד בנתונים קשיחים
 * - מבצעת חיוב של 1 שקל עבור פריט "Pen" 
 * - משתמשת בכרטיס אשראי מוקשח עם תוקף עד 11/2030
 * - מחזירה את תוצאות החיוב או מעבירה שגיאות למטפל הבא
 * 
 * נתונים קשיחים שהפונקציה משתמשת בהם תמיד:
 * - Terminal: 'yaazorutok'
 * - כרטיס: 'ieff4b4e3bae1df4580'
 * - CVV: '123'
 * - תוקף: 11/2030
 * - סכום: 1.0 שקל עבור עט אחד
 */

import { NextFunction, Request, Response } from 'express';
import { chargeTokenTranzila } from '../../controller/ApiTranzila';
import { charge } from '../../tranzila/Authentication';

// מוק את מודול Authentication של Tranzila כדי לשלוט על התגובות בטסטים
jest.mock('../../tranzila/Authentication');

/**
 * חבילת טסטים עבור ApiTranzila Controller
 * בודקת את פונקציונליות חיוב כרטיסי אשראי דרך API של Tranzila
 * הפונקציה chargeTokenTranzila מבצעת חיוב עם נתונים קשיחים ללא קשר לתוכן הבקשה
 * 
 * סוגי הטסטים בקובץ:
 * 1. טסטי הצלחה - בודקים תרחישים תקינים
 * 2. טסטי כשלון - בודקים טיפול בשגיאות שונות
 * 3. טסטי קצה - בודקים מצבים חריגים (null, undefined)
 * 4. טסטי אבטחה - מוודאים שהפונקציה לא מושפעת מקלט חיצוני
 */
describe('ApiTranzila Controller Tests', () => {
    // אובייקטים מזויפים לסימולציה של Express.js
    let req: Partial<Request>;    // אובייקט בקשה מזויף - מכיל body ומאפיינים אחרים של HTTP request
    let res: Partial<Response>;   // אובייקט תגובה מזויף - מכיל פונקציות כמו status() ו-json()
    let next: NextFunction;       // פונקציה למעבר למטפל הבא במקרה של שגיאה

    /**
     * הכנה לפני כל טסט:
     * - מאתחל אובייקטי request, response ו-next function מזויפים
     * - מנקה את כל המוקים הקיימים
     * - מבטל הדפסות console כדי לשמור על ניקיון הפלט של הטסטים
     */
    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
        
        // Mock console methods to avoid log pollution in tests
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    /**
     * ניקוי אחרי כל טסט:
     * מחזיר את כל המוקים למצב המקורי שלהם
     */
    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * קבוצת טסטים עבור הפונקציה chargeTokenTranzila
     * בודקת תרחישים שונים של חיוב כרטיסי אשראי דרך Tranzila
     */
    describe('chargeTokenTranzila', () => {
        /**
         * טסט הזהב - בודק תרחיש חיוב מוצלח רגיל
         * מוודא שהפונקציה מבצעת חיוב עם הנתונים הקשיחים הנכונים ומחזירה תגובה חיובית
         * בודק את כל השלבים: לוגים, קריאה לAPI, תגובה עם סטטוס 200
         */
        it('should process charge request successfully', async () => {
            const requestBody = {
                amount: 100,
                description: 'Test payment'
            };
            req.body = requestBody;

            const mockChargeResult = {
                transaction_id: 'trx_123456',
                status: 'approved',
                amount: 1.0,
                currency: 'ILS',
                approval_code: 'ABC123',
                terminal_name: 'yaazorutok'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieff4b4e3bae1df4580',
                items: [
                    {
                        name: 'Pen',
                        type: 'I',
                        unit_price: 1.0,
                        units_number: 1,
                    },
                ],
            });
            expect(console.log).toHaveBeenCalledWith('result after charge');
            expect(console.log).toHaveBeenCalledWith(mockChargeResult);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        /**
         * בודק שהפונקציה מתעלמת מתוכן הבקשה השונה ועדיין משתמשת בנתונים הקשיחים
         * מוודא שגם עם נתוני בקשה מורכבים, הפונקציה עובדת באותו אופן
         * זה חשוב כי הפונקציה תמיד משתמשת באותם נתונים ללא קשר לבקשה
         */
        it('should handle charge request with different body content', async () => {
            const requestBody = {
                customer_id: 'cust_789',
                payment_method: 'credit_card',
                metadata: {
                    order_id: 'order_456'
                }
            };
            req.body = requestBody;

            const mockChargeResult = {
                transaction_id: 'trx_789012',
                status: 'approved',
                amount: 1.0,
                currency: 'ILS',
                approval_code: 'XYZ789'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieff4b4e3bae1df4580',
                items: [
                    {
                        name: 'Pen',
                        type: 'I',
                        unit_price: 1.0,
                        units_number: 1,
                    },
                ],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        /**
         * בודק טיפול בבקשה ריקה (body ריק)
         * מוודא שהפונקציה לא קורסת כשאין תוכן בבקשה ועדיין מבצעת את החיוב
         * חשוב לעמידות הפונקציה בפני קלטים לא תקינים
         */
        it('should handle empty request body', async () => {
            req.body = {};

            const mockChargeResult = {
                transaction_id: 'trx_empty',
                status: 'approved',
                amount: 1.0,
                currency: 'ILS'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieff4b4e3bae1df4580',
                items: [
                    {
                        name: 'Pen',
                        type: 'I',
                        unit_price: 1.0,
                        units_number: 1,
                    },
                ],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        /**
         * בודק טיפול בעסקה שנדחתה על ידי הבנק
         * מוודא שהפונקציה מחזירה תגובה תקינה גם כשהחיוב נדחה
         * חשוב לטיפול במצבים שבהם הבנק דוחה את העסקה (חריגה ממסגרת, כרטיס חסום וכו')
         */
        it('should handle charge with declined transaction', async () => {
            req.body = { amount: 50 };

            const mockChargeResult = {
                transaction_id: 'trx_declined',
                status: 'declined',
                amount: 1.0,
                currency: 'ILS',
                error_code: '05',
                error_message: 'Do not honor',
                terminal_name: 'yaazorutok'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('result after charge');
            expect(console.log).toHaveBeenCalledWith(mockChargeResult);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        /**
         * בודק טיפול בשגיאות אימות מול API של Tranzila
         * מוודא שהפונקציה מעבירה שגיאות אימות ל-middleware הבא (next function)
         * חשוב לטיפול בשגיאות כמו API key שגוי, הרשאות לא תקינות וכו'
         */
        it('should handle authentication errors from Tranzila API', async () => {
            req.body = { amount: 100 };

            const authError = new Error('Authentication failed');
            authError.name = 'TranzilaAuthError';
            (charge as jest.Mock).mockRejectedValue(authError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(authError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        /**
         * בודק טיפול בשגיאות רשת (timeout, connection errors)
         * מוודא שהפונקציה מעבירה שגיאות רשת ל-middleware הבא
         * חשוב לטיפול במצבים של אינטרנט לא יציב או שרתי Tranzila לא זמינים
         */
        it('should handle network errors during charge', async () => {
            req.body = { amount: 200 };

            const networkError = new Error('Network timeout');
            networkError.name = 'NetworkError';
            (charge as jest.Mock).mockRejectedValue(networkError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(networkError);
        });

        /**
         * בודק טיפול בשגיאות כרטיס אשראי לא תקין
         * מוודא שהפונקציה מטפלת בשגיאות כמו מספר כרטיס שגוי, CVV שגוי וכו'
         * חשוב לוולידציה של נתוני כרטיס האשראי הקשיחים
         */
        it('should handle invalid card errors', async () => {
            req.body = { amount: 150 };

            const cardError = new Error('Invalid card number');
            cardError.name = 'CardError';
            (charge as jest.Mock).mockRejectedValue(cardError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieff4b4e3bae1df4580',
                items: [
                    {
                        name: 'Pen',
                        type: 'I',
                        unit_price: 1.0,
                        units_number: 1,
                    },
                ],
            });
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(cardError);
        });

        /**
         * בודק טיפול בשגיאות Rate Limiting של API
         * מוודא שהפונקציה מטפלת במצב של יותר מדי בקשות לAPI בזמן קצר
         * חשוב להגנה מפני חסימה זמנית של הAPIלפלט
         */
        it('should handle API rate limit errors', async () => {
            req.body = { amount: 300 };

            const rateLimitError = new Error('Rate limit exceeded');
            rateLimitError.name = 'RateLimitError';
            (charge as jest.Mock).mockRejectedValue(rateLimitError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(rateLimitError);
        });

        /**
         * בודק טיפול בשגיאות לא צפויות מהשרת
         * מוודא שהפונקציה מטפלת בכל סוג של שגיאה שלא נבדקה במפורש
         * חשוב לעמידות הפונקציה מול תקלות לא צפויות
         */
        it('should handle unexpected errors during charge processing', async () => {
            req.body = { amount: 75 };

            const unexpectedError = new Error('Unexpected server error');
            (charge as jest.Mock).mockRejectedValue(unexpectedError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(unexpectedError);
        });

        /**
         * טסט קריטי - מוודא שהפונקציה משתמשת תמיד בנתונים הקשיחים
         * בודק שגם כשמועברים נתונים שונים בבקשה, הפונקציה מתעלמת מהם
         * זה חשוב מאוד כי מראה שהפונקציה לא פגיעה לmangles ובבקשות זדוניות
         * הנתונים הקשיחים: terminal 'yaazorutok', כרטיס מוקשח, תאריך תפוגה קבוע
         */
        it('should always use hardcoded transaction data regardless of request body', async () => {
            const complexBody = {
                terminal_name: 'different_terminal',
                expire_month: 12,
                expire_year: 2025,
                cvv: '456',
                card_number: 'different_card_number',
                items: [
                    {
                        name: 'Different Item',
                        type: 'S',
                        unit_price: 99.99,
                        units_number: 5,
                    },
                ],
                amount: 500,
                currency: 'USD'
            };
            req.body = complexBody;

            const mockChargeResult = {
                transaction_id: 'trx_hardcoded',
                status: 'approved'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            // Verify that the hardcoded values are used, not the request body values
            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieff4b4e3bae1df4580',
                items: [
                    {
                        name: 'Pen',
                        type: 'I',
                        unit_price: 1.0,
                        units_number: 1,
                    },
                ],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        /**
         * בודק טיפול בתגובה null מפונקציית charge
         * מוודא שהפונקציה לא קורסת כשמקבלת null ומחזירה אותו למשתמש
         * חשוב לעמידות הפונקציה בפני תגובות לא צפויות מהAPI
         */
        it('should handle null response from charge function', async () => {
            req.body = { amount: 25 };

            (charge as jest.Mock).mockResolvedValue(null);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('result after charge');
            expect(console.log).toHaveBeenCalledWith(null);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        /**
         * בודק טיפול בתגובה undefined מפונקציית charge
         * מוודא שהפונקציה מטפלת גם בundefined באופן תקין
         * חשוב לכיסוי של כל המצבים האפשריים של תגובות API
         */
        it('should handle undefined response from charge function', async () => {
            req.body = { test: 'data' };

            (charge as jest.Mock).mockResolvedValue(undefined);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(charge).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('result after charge');
            expect(console.log).toHaveBeenCalledWith(undefined);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(undefined);
        });

        /**
         * בודק טיפול בשגיאה סינכרונית (שגיאה שזורקת מיד ולא מחזירה Promise)
         * מוודא שהפונקציה מטפלת גם בשגיאות שלא קשורות לasync/await
         * חשוב לכיסוי של כל סוגי השגיאות האפשריות
         */
        it('should handle charge function throwing synchronous error', async () => {
            req.body = { amount: 400 };

            const syncError = new Error('Synchronous error');
            (charge as jest.Mock).mockImplementation(() => {
                throw syncError;
            });

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(console.log).toHaveBeenCalledWith('error in charge!!');
            expect(next).toHaveBeenCalledWith(syncError);
        });

        /**
         * בודק שהפונקציה מדפיסה לוגים נכונים לצורך דיבוג
         * מוודא שכל השלבים מתועדים: התחלת תהליך, תוצאות וכו'
         * חשוב למעקב ודיבוג בעיות בסביבת הפרודקשן
         */
        it('should log transaction details correctly for debugging', async () => {
            req.body = { debug: true };

            const mockChargeResult = {
                transaction_id: 'trx_debug',
                status: 'approved',
                timestamp: '2023-12-01T10:00:00Z'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(console.log).toHaveBeenCalledWith('charge11');
            expect(console.log).toHaveBeenCalledWith('result after charge');
            expect(console.log).toHaveBeenCalledWith(mockChargeResult);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });
    });
});
