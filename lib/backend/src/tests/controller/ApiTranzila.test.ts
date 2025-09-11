import { NextFunction, Request, Response } from 'express';
import { chargeTokenTranzila } from '../../controller/ApiTranzila';
import { charge } from '../../tranzila/Authentication';

jest.mock('../../tranzila/Authentication');

describe('ApiTranzila Controller Tests', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction

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
        
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('chargeTokenTranzila', () => {
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

            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ief5vvfe3baet610f80',
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
            
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });

        it('should handle authentication errors from Tranzila API', async () => {
            req.body = { amount: 100 };

            const authError = new Error('Authentication failed');
            authError.name = 'TranzilaAuthError';
            (charge as jest.Mock).mockRejectedValue(authError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            expect(charge).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(authError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle network errors during charge', async () => {
            req.body = { amount: 200 };

            const networkError = new Error('Network timeout');
            networkError.name = 'NetworkError';
            (charge as jest.Mock).mockRejectedValue(networkError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            expect(charge).toHaveBeenCalled();
            
            expect(next).toHaveBeenCalledWith(networkError);
        });

        it('should handle invalid card errors', async () => {
            req.body = { amount: 150 };

            const cardError = new Error('Invalid card number');
            cardError.name = 'CardError';
            (charge as jest.Mock).mockRejectedValue(cardError);

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
            
            expect(next).toHaveBeenCalledWith(cardError);
        });

        it('should handle API rate limit errors', async () => {
            req.body = { amount: 300 };

            const rateLimitError = new Error('Rate limit exceeded');
            rateLimitError.name = 'RateLimitError';
            (charge as jest.Mock).mockRejectedValue(rateLimitError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            expect(charge).toHaveBeenCalled();
            
            expect(next).toHaveBeenCalledWith(rateLimitError);
        });

        it('should handle unexpected errors during charge processing', async () => {
            req.body = { amount: 75 };

            const unexpectedError = new Error('Unexpected server error');
            (charge as jest.Mock).mockRejectedValue(unexpectedError);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            expect(charge).toHaveBeenCalled();
            
            expect(next).toHaveBeenCalledWith(unexpectedError);
        });

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

            expect(charge).toHaveBeenCalledWith({
                terminal_name: 'yaazorutok',
                expire_month: 11,
                expire_year: 2030,
                cvv: '123',
                card_number: 'ieffl88e3bae1dfgdf550',
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

        it('should handle null response from charge function', async () => {
            req.body = { amount: 25 };

            (charge as jest.Mock).mockResolvedValue(null);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            expect(charge).toHaveBeenCalled();
            
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        it('should handle undefined response from charge function', async () => {
            req.body = { test: 'data' };

            (charge as jest.Mock).mockResolvedValue(undefined);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            expect(charge).toHaveBeenCalled();
            
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(undefined);
        });

        it('should handle charge function throwing synchronous error', async () => {
            req.body = { amount: 400 };

            const syncError = new Error('Synchronous error');
            (charge as jest.Mock).mockImplementation(() => {
                throw syncError;
            });

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            
            expect(next).toHaveBeenCalledWith(syncError);
        });

        it('should log transaction details correctly for debugging', async () => {
            req.body = { debug: true };

            const mockChargeResult = {
                transaction_id: 'trx_debug',
                status: 'approved',
                timestamp: '2023-12-01T10:00:00Z'
            };

            (charge as jest.Mock).mockResolvedValue(mockChargeResult);

            await chargeTokenTranzila(req as Request, res as Response, next);

            
            
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockChargeResult);
        });
    });
});
