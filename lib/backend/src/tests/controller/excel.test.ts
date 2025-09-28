import { NextFunction, Request, Response } from 'express';
import { processCustomerDeviceExcel } from '../../controller/excel';
import { readExcelFile } from '../../utils/excel';
import { processCustomerDeviceExcelData } from '../../service/excel/CustomerDeviceExcelService';
import * as fs from 'fs';

jest.mock('../../utils/excel');
jest.mock('../../service/excel/CustomerDeviceExcelService');
jest.mock('fs');

describe('Excel Controller Tests', () => {
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
        
        // Mock console methods to avoid log pollution in tests
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('processCustomerDeviceExcel', () => {
        it('should process Customer-Device Excel file successfully without errors', async () => {
            const mockFile = {
                filename: 'customer-devices.xlsx',
                path: '/temp/customer-devices.xlsx'
            };
            
            const mockExcelData = [
                { 
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@example.com',
                    phone_number: '123456789',
                    device_number: 'DEV001',
                    IMEI_1: 'IMEI123456789'
                },
                { 
                    first_name: 'Jane',
                    last_name: 'Smith',
                    email: 'jane@example.com',
                    phone_number: '987654321',
                    device_number: 'DEV002',
                    IMEI_1: 'IMEI987654321'
                }
            ];

            const mockProcessingResults = {
                totalRows: 2,
                successCount: 2,
                errorsCount: 0,
                errorFilePath: undefined
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processCustomerDeviceExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await processCustomerDeviceExcel(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/customer-devices.xlsx');
            expect(processCustomerDeviceExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/customer-devices.xlsx');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'עיבוד קובץ לקוחות-מכשירים הושלם בהצלחה! 🎉',
                results: {
                    totalRows: 2,
                    successCount: 2,
                    errorsCount: 0,
                    successRate: '100%'
                },
                sampleData: mockExcelData.slice(0, 3)
            });
        });

        it('should return 400 if no file is uploaded', async () => {
            req.file = undefined;

            await processCustomerDeviceExcel(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'לא הועלה קובץ Excel'
            });
            expect(readExcelFile).not.toHaveBeenCalled();
            expect(processCustomerDeviceExcelData).not.toHaveBeenCalled();
        });
    });
});
