import { NextFunction, Request, Response } from 'express';
import { handleReadExcelFile } from '../../controller/excel';
import { readExcelFile } from '../../utils/excel';
import { processExcelData } from '../../service/ReadExcelDevicesForDonors';
import * as fs from 'fs';

jest.mock('../../utils/excel');
jest.mock('../../service/ReadExcelDevicesForDonors');
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

    describe('handleReadExcelFile', () => {
        it('should process Excel file successfully without errors', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 },
                { device_id: '2', donator_name: 'Jane Smith', amount: 1500 }
            ];

            const mockProcessingResults = {
                totalRows: 2,
                successCount: 2,
                errorsCount: 0,
                errorFilePath: null
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(processExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד בהצלחה',
                totalRows: 2,
                successCount: 2,
                errorsCount: 0,
                data: mockExcelData.slice(0, 3)
            });
        });

        it('should process Excel file successfully with errors and generate error file', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 },
                { device_id: '2', donator_name: 'Invalid Data', amount: 'invalid' }
            ];

            const mockProcessingResults = {
                totalRows: 2,
                successCount: 1,
                errorsCount: 1,
                errorFilePath: '/temp/errors_output.xlsx'
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(processExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד עם 1 שגיאות. קובץ שגיאות נוצר.',
                totalRows: 2,
                successCount: 1,
                errorsCount: 1,
                errorFileGenerated: true,
                data: mockExcelData.slice(0, 3)
            });
        });

        it('should return 400 if no file is uploaded', async () => {
            req.file = undefined;

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'לא הועלה קובץ Excel'
            });
            expect(readExcelFile).not.toHaveBeenCalled();
            expect(processExcelData).not.toHaveBeenCalled();
        });

        it('should handle errors during Excel file reading', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const readError = new Error('Failed to read Excel file');
            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockRejectedValue(readError);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(next).toHaveBeenCalledWith(readError);
            expect(processExcelData).not.toHaveBeenCalled();
        });

        it('should handle errors during data processing', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 }
            ];

            const processingError = new Error('Database error during processing');
            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockRejectedValue(processingError);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(processExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(next).toHaveBeenCalledWith(processingError);
        });

        it('should handle file deletion errors after successful processing', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 }
            ];

            const mockProcessingResults = {
                totalRows: 1,
                successCount: 1,
                errorsCount: 0,
                errorFilePath: null
            };

            const deleteError = new Error('File is locked');
            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {
                throw deleteError;
            });

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(processExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד בהצלחה',
                totalRows: 1,
                successCount: 1,
                errorsCount: 0,
                data: mockExcelData.slice(0, 3)
            });
        });

        it('should handle file deletion errors after processing error', async () => {
            const mockFile = {
                filename: 'test.xlsx',
                path: '/temp/test.xlsx'
            };
            
            const processingError = new Error('Processing failed');
            const deleteError = new Error('File is locked');
            
            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockRejectedValue(processingError);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {
                throw deleteError;
            });

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(fs.unlinkSync).toHaveBeenCalledWith('/temp/test.xlsx');
            expect(next).toHaveBeenCalledWith(processingError);
        });

        it('should handle large Excel files and return only first 3 rows as sample', async () => {
            const mockFile = {
                filename: 'large_test.xlsx',
                path: '/temp/large_test.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 },
                { device_id: '2', donator_name: 'Jane Smith', amount: 1500 },
                { device_id: '3', donator_name: 'Bob Johnson', amount: 2000 },
                { device_id: '4', donator_name: 'Alice Brown', amount: 2500 },
                { device_id: '5', donator_name: 'Charlie Wilson', amount: 3000 }
            ];

            const mockProcessingResults = {
                totalRows: 5,
                successCount: 5,
                errorsCount: 0,
                errorFilePath: null
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד בהצלחה',
                totalRows: 5,
                successCount: 5,
                errorsCount: 0,
                data: mockExcelData.slice(0, 3) // Only first 3 rows
            });
        });

        it('should not delete file if req.file is undefined during error handling', async () => {
            req.file = undefined;
            const error = new Error('Some error');
            (readExcelFile as jest.Mock).mockRejectedValue(error);

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(fs.unlinkSync).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'לא הועלה קובץ Excel'
            });
        });

        it('should handle empty Excel file', async () => {
            const mockFile = {
                filename: 'empty.xlsx',
                path: '/temp/empty.xlsx'
            };
            
            const mockExcelData: any[] = [];

            const mockProcessingResults = {
                totalRows: 0,
                successCount: 0,
                errorsCount: 0,
                errorFilePath: null
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(readExcelFile).toHaveBeenCalledWith('/temp/empty.xlsx');
            expect(processExcelData).toHaveBeenCalledWith(mockExcelData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד בהצלחה',
                totalRows: 0,
                successCount: 0,
                errorsCount: 0,
                data: []
            });
        });

        it('should handle mixed success and error results correctly', async () => {
            const mockFile = {
                filename: 'mixed.xlsx',
                path: '/temp/mixed.xlsx'
            };
            
            const mockExcelData = [
                { device_id: '1', donator_name: 'John Doe', amount: 1000 },
                { device_id: '2', donator_name: 'Jane Smith', amount: 1500 },
                { device_id: '3', donator_name: 'Invalid', amount: 'bad_data' }
            ];

            const mockProcessingResults = {
                totalRows: 3,
                successCount: 2,
                errorsCount: 1,
                errorFilePath: '/temp/errors_123.xlsx'
            };

            req.file = mockFile as any;
            (readExcelFile as jest.Mock).mockResolvedValue(mockExcelData);
            (processExcelData as jest.Mock).mockResolvedValue(mockProcessingResults);
            (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

            await handleReadExcelFile(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({
                message: 'הקובץ עובד עם 1 שגיאות. קובץ שגיאות נוצר.',
                totalRows: 3,
                successCount: 2,
                errorsCount: 1,
                errorFileGenerated: true,
                data: mockExcelData.slice(0, 3)
            });
        });
    });
});
