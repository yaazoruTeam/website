import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@model';
import {
    terminateMobile,
    provResetVmPincode,
    getPackagesWithInfo,
    changePackages,
    ComprehensiveResetDeviceController,
    sendApn,
    changeNetwork,
    addOneTimePackage,
    freezeUnFreezeMobile,
    updateImeiLockStatus,
    searchUsers,
    getMobiles,
    getMobileInfo,
    getAllUserData
} from '../../controller/widely';
import { callingWidely } from '../../integration/widely/callingWidely';
import { sendMobileAction, ComprehensiveResetDevice } from '../../integration/widely/widelyActions';
import { validateRequiredParams, validateWidelyResult } from '../../utils/widelyValidation';
import { config } from '../../config/index';

jest.mock('../../integration/widely/callingWidely');
jest.mock('../../integration/widely/widelyActions');
jest.mock('../../utils/widelyValidation');
jest.mock('../../config/index', () => ({
    config: {
        widely: {
            accountId: 'test_account_123'
        }
    }
}));

describe('Widely Controllers Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

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
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Actions Controller Tests', () => {
        describe('terminateMobile', () => {
            it('should terminate mobile successfully', async () => {
                const requestBody = { endpoint_id: '12345' };
                req.body = requestBody;

                const mockResult = {
                    error_code: 200,
                    message: 'Mobile terminated successfully',
                    data: { endpoint_id: '12345', status: 'terminated' }
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await terminateMobile(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345' });
                expect(callingWidely).toHaveBeenCalledWith('prov_terminate_mobile', { endpoint_id: '12345' });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should handle validation errors', async () => {
                req.body = {};
                const validationError = new Error('endpoint_id is required');
                (validateRequiredParams as jest.Mock).mockImplementation(() => {
                    throw validationError;
                });

                await terminateMobile(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith(validationError);
                expect(callingWidely).not.toHaveBeenCalled();
            });

            it('should handle API errors', async () => {
                req.body = { endpoint_id: '12345' };
                const apiError = new Error('API connection failed');
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockRejectedValue(apiError);

                await terminateMobile(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith(apiError);
            });
        });

        describe('provResetVmPincode', () => {
            it('should reset VM pincode successfully', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = { success: true, message: 'VM pincode reset' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await provResetVmPincode(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345' });
                expect(sendMobileAction).toHaveBeenCalledWith('12345', 'prov_reset_vm_pincode');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should handle mobile action errors', async () => {
                req.body = { endpoint_id: '12345' };
                const actionError = new Error('Mobile action failed');
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockRejectedValue(actionError);

                await provResetVmPincode(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith(actionError);
            });
        });

        describe('changeNetwork', () => {
            it('should change network to pelephone_and_partner successfully', async () => {
                req.body = { endpoint_id: '12345', network_name: 'pelephone_and_partner' };
                const mockResult = { success: true, network: 'changed' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await changeNetwork(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345', network_name: 'pelephone_and_partner' });
                expect(sendMobileAction).toHaveBeenCalledWith(12345, 'both_networks_pl_first_force');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should change network to hot_and_partner successfully', async () => {
                req.body = { endpoint_id: '67890', network_name: 'hot_and_partner' };
                const mockResult = { success: true, network: 'changed' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await changeNetwork(req as Request, res as Response, next);

                expect(sendMobileAction).toHaveBeenCalledWith(67890, 'both_networks_ht_first_force');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should change network to pelephone only successfully', async () => {
                req.body = { endpoint_id: '55555', network_name: 'pelephone' };
                const mockResult = { success: true, network: 'changed' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await changeNetwork(req as Request, res as Response, next);

                expect(sendMobileAction).toHaveBeenCalledWith(55555, 'pelephone_only_force');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should handle case insensitive network names', async () => {
                req.body = { endpoint_id: '12345', network_name: 'PELEPHONE_AND_PARTNER' };
                const mockResult = { success: true, network: 'changed' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await changeNetwork(req as Request, res as Response, next);

                expect(sendMobileAction).toHaveBeenCalledWith(12345, 'both_networks_pl_first_force');
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it('should return 400 for invalid network name', async () => {
                req.body = { endpoint_id: '12345', network_name: 'invalid_network' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await changeNetwork(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid network_name provided. Use one of: "pelephone_and_partner", "hot_and_partner", "pelephone".'
                });
                expect(sendMobileAction).not.toHaveBeenCalled();
            });
        });

        describe('getPackagesWithInfo', () => {
            it('should get base packages successfully', async () => {
                req.body = { package_types: 'base' };
                const mockResult = {
                    error_code: 200,
                    data: [{ package_id: 1, name: 'Basic Package' }]
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getPackagesWithInfo(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ package_types: 'base' });
                expect(callingWidely).toHaveBeenCalledWith('get_packages_with_info', {
                    reseller_domain_id: 'test_account_123',
                    package_types: ['base']
                });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should get extra packages successfully', async () => {
                req.body = { package_types: 'extra' };
                const mockResult = {
                    error_code: 200,
                    data: [{ package_id: 2, name: 'Extra Package' }]
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getPackagesWithInfo(req as Request, res as Response, next);

                expect(callingWidely).toHaveBeenCalledWith('get_packages_with_info', {
                    reseller_domain_id: 'test_account_123',
                    package_types: ['extra']
                });
            });

            it('should return 400 for invalid package_types', async () => {
                req.body = { package_types: 'invalid' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await getPackagesWithInfo(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid package_types provided. It must be "base" or "extra".'
                });
                expect(callingWidely).not.toHaveBeenCalled();
            });
        });

        describe('changePackages', () => {
            it('should change package successfully', async () => {
                req.body = { endpoint_id: '12345', package_id: '100' };
                const mockResult = {
                    error_code: 200,
                    message: 'Package changed successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});

                await changePackages(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345', package_id: '100' });
                expect(callingWidely).toHaveBeenCalledWith('prov_update_mobile_subscription', {
                    endpoint_id: '12345',
                    service_id: '100'
                });
                expect(validateWidelyResult).toHaveBeenCalledWith(mockResult, 'Failed to change package');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should return 400 for invalid package_id', async () => {
                req.body = { endpoint_id: '12345', package_id: 'invalid' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await changePackages(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid package_id provided. It must be a number.'
                });
                expect(callingWidely).not.toHaveBeenCalled();
            });

            it('should return 400 for missing package_id', async () => {
                req.body = { endpoint_id: '12345', package_id: null };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await changePackages(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid package_id provided. It must be a number.'
                });
            });
        });

        describe('ComprehensiveResetDeviceController', () => {
            it('should reset device comprehensively', async () => {
                req.body = { endpoint_id: '12345', name: 'Test Device' };
                const mockResult = {
                    originalInfo: { device_name: 'Test Device' },
                    terminationResult: { error_code: 200 },
                    creationResult: { error_code: 200, data: [{ endpoint_id: '67890' }] }
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (ComprehensiveResetDevice as jest.Mock).mockResolvedValue(mockResult);

                await ComprehensiveResetDeviceController(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345', name: 'Test Device' });
                expect(ComprehensiveResetDevice).toHaveBeenCalledWith('12345', 'Test Device');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: 'Device reset completed successfully',
                    data: {
                        originalInfo: { device_name: 'Test Device' },
                        terminationSuccess: true,
                        creationSuccess: true,
                        newEndpointId: '67890',
                        terminationResult: { error_code: 200 },
                        creationResult: { error_code: 200, data: [{ endpoint_id: '67890' }] }
                    }
                });
            });

            it('should handle reset with undefined error codes', async () => {
                req.body = { endpoint_id: '12345', name: 'Test Device' };
                const mockResult = {
                    originalInfo: { device_name: 'Test Device' },
                    terminationResult: { error_code: undefined },
                    creationResult: { error_code: undefined, data: [] }
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (ComprehensiveResetDevice as jest.Mock).mockResolvedValue(mockResult);

                await ComprehensiveResetDeviceController(req as Request, res as Response, next);

                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: 'Device reset completed successfully',
                    data: {
                        originalInfo: { device_name: 'Test Device' },
                        terminationSuccess: true,
                        creationSuccess: true,
                        newEndpointId: null,
                        terminationResult: { error_code: undefined },
                        creationResult: { error_code: undefined, data: [] }
                    }
                });
            });
        });

        describe('sendApn', () => {
            it('should send APN successfully', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = { success: true, message: 'APN sent' };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (sendMobileAction as jest.Mock).mockResolvedValue(mockResult);

                await sendApn(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345' });
                expect(sendMobileAction).toHaveBeenCalledWith('12345', 'send_apn');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: 'APN settings have been sent successfully',
                    data: mockResult
                });
            });
        });

        describe('addOneTimePackage', () => {
            it('should add one-time package successfully', async () => {
                req.body = { endpoint_id: '12345', domain_user_id: '67890', package_id: '100' };
                const mockResult = {
                    error_code: 200,
                    message: 'Package added successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});

                await addOneTimePackage(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({
                    endpoint_id: '12345',
                    domain_user_id: '67890',
                    package_id: '100'
                });
                expect(callingWidely).toHaveBeenCalledWith('add_once_off_subscription', {
                    account_id: 'test_account_123',
                    domain_user_id: '67890',
                    endpoint_id: '12345',
                    new_package_ids: ['100']
                });
                expect(validateWidelyResult).toHaveBeenCalledWith(mockResult, 'Failed to add one-time package');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should return 400 for invalid package_id', async () => {
                req.body = { endpoint_id: '12345', domain_user_id: '67890', package_id: 'invalid' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await addOneTimePackage(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid package_id provided. It must be a number.'
                });
                expect(callingWidely).not.toHaveBeenCalled();
            });
        });

        describe('freezeUnFreezeMobile', () => {
            it('should freeze mobile successfully', async () => {
                req.body = { endpoint_id: '12345', action: 'freeze' };
                const mockResult = {
                    error_code: 200,
                    message: 'Mobile frozen successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await freezeUnFreezeMobile(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345', action: 'freeze' });
                expect(callingWidely).toHaveBeenCalledWith('freeze_unfreeze_endpoint', {
                    endpoint_id: '12345',
                    action: 'freeze'
                });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should unfreeze mobile successfully', async () => {
                req.body = { endpoint_id: '12345', action: 'unfreeze' };
                const mockResult = {
                    error_code: 200,
                    message: 'Mobile unfrozen successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await freezeUnFreezeMobile(req as Request, res as Response, next);

                expect(callingWidely).toHaveBeenCalledWith('freeze_unfreeze_endpoint', {
                    endpoint_id: '12345',
                    action: 'unfreeze'
                });
            });

            it('should return 400 for invalid action', async () => {
                req.body = { endpoint_id: '12345', action: 'invalid' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await freezeUnFreezeMobile(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid action provided. It must be either "freeze" or "unfreeze".'
                });
                expect(callingWidely).not.toHaveBeenCalled();
            });
        });

        describe('updateImeiLockStatus', () => {
            it('should lock IMEI successfully', async () => {
                req.body = { endpoint_id: '12345', iccid: 'SIM123456', action: true };
                const mockResult = {
                    error_code: 200,
                    message: 'IMEI locked successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});

                await updateImeiLockStatus(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({
                    endpoint_id: '12345',
                    iccid: 'SIM123456',
                    action: true
                });
                expect(callingWidely).toHaveBeenCalledWith('prov_update_mobile', {
                    endpoint_id: '12345',
                    iccid: 'SIM123456',
                    lock_on_first_imei: true
                });
                expect(validateWidelyResult).toHaveBeenCalledWith(mockResult, 'Failed to lock IMEI lock');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should unlock IMEI successfully', async () => {
                req.body = { endpoint_id: '12345', iccid: 'SIM123456', action: false };
                const mockResult = {
                    error_code: 200,
                    message: 'IMEI unlocked successfully'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});

                await updateImeiLockStatus(req as Request, res as Response, next);

                expect(validateWidelyResult).toHaveBeenCalledWith(mockResult, 'Failed to unlock IMEI lock');
            });

            it('should return 400 for non-boolean action', async () => {
                req.body = { endpoint_id: '12345', iccid: 'SIM123456', action: 'invalid' };
                (validateRequiredParams as jest.Mock).mockImplementation(() => {});

                await updateImeiLockStatus(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Invalid action provided. It must be a boolean value (true/false).'
                });
                expect(callingWidely).not.toHaveBeenCalled();
            });
        });
    });

    describe('Get Actions Controller Tests', () => {
        describe('searchUsers', () => {
            it('should search users successfully', async () => {
                req.body = { simNumber: '1234567890' };
                const mockResult = {
                    error_code: 200,
                    data: [{
                        domain_user_id: '12345',
                        domain_user_name: 'testuser',
                        name: 'Test User'
                    }]
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await searchUsers(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ simNumber: '1234567890' });
                expect(callingWidely).toHaveBeenCalledWith('search_users', {
                    account_id: 'test_account_123',
                    search_string: '1234567890'
                });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult.data[0]);
            });

            it('should return 404 when no users found', async () => {
                req.body = { simNumber: '9999999999' };
                const mockResult = {
                    error_code: 200,
                    data: []
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await searchUsers(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'SIM number not found.'
                });
            });

            it('should return 404 when multiple users found', async () => {
                req.body = { simNumber: '1111111111' };
                const mockResult = {
                    error_code: 200,
                    data: [
                        { domain_user_id: '1', name: 'User 1' },
                        { domain_user_id: '2', name: 'User 2' }
                    ]
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await searchUsers(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'Multiple SIM numbers found - please provide more specific SIM number.'
                });
            });

            it('should return 404 when user data is invalid', async () => {
                req.body = { simNumber: '2222222222' };
                const mockResult = {
                    error_code: 200,
                    data: [{}] // Empty user object
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await searchUsers(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'SIM number not found.'
                });
            });
        });

        describe('getMobiles', () => {
            it('should get mobiles successfully', async () => {
                req.body = { domain_user_id: '12345' };
                const mockResult = {
                    error_code: 200,
                    data: [{
                        endpoint_id: '67890',
                        device_name: 'Test Device'
                    }]
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobiles(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ domain_user_id: '12345' });
                expect(callingWidely).toHaveBeenCalledWith('get_mobiles', { domain_user_id: '12345' });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult.data[0]);
            });

            it('should return 404 when no mobiles found', async () => {
                req.body = { domain_user_id: '99999' };
                const mockResult = {
                    error_code: 200,
                    data: []
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobiles(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'No devices found for this user.'
                });
            });
        });

        describe('getMobileInfo', () => {
            it('should get mobile info successfully with data property', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = {
                    error_code: 200,
                    data: {
                        endpoint_id: '12345',
                        device_name: 'Test Device',
                        status: 'active'
                    }
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobileInfo(req as Request, res as Response, next);

                expect(validateRequiredParams).toHaveBeenCalledWith({ endpoint_id: '12345' });
                expect(callingWidely).toHaveBeenCalledWith('get_mobile_info', { endpoint_id: '12345' });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult.data);
            });

            it('should get mobile info successfully with direct object response', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = {
                    endpoint_id: '12345',
                    device_name: 'Test Device',
                    status: 'active'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobileInfo(req as Request, res as Response, next);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockResult);
            });

            it('should handle error_code !== 200', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = {
                    error_code: 404,
                    message: 'Device not found'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobileInfo(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'Failed to load device details.'
                });
            });

            it('should handle empty data response', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = {
                    error_code: 200,
                    data: {}
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobileInfo(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Error loading device details.'
                });
            });

            it('should handle empty direct object response', async () => {
                req.body = { endpoint_id: '12345' };
                const mockResult = {};

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValue(mockResult);

                await getMobileInfo(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Error loading device details.'
                });
            });
        });

        describe('getAllUserData', () => {
            it('should get all user data successfully', async () => {
                req.body = { simNumber: '1234567890' };

                // Mock searchUsersData
                const searchResult = {
                    error_code: 200,
                    data: [{
                        domain_user_id: '12345',
                        domain_user_name: 'testuser'
                    }]
                };

                // Mock getMobilesData 
                const mobileResult = {
                    error_code: 200,
                    data: [{
                        endpoint_id: '67890'
                    }]
                };

                // Mock getMobileInfoData
                const mobileInfoResult = {
                    error_code: 200,
                    data: {
                        domain_user_id: 12345,
                        subscriptions: [{
                            data: [{
                                usage: 2.5
                            }]
                        }],
                        data_limit: 10.0,
                        registration_info: {
                            mcc_mnc: '425_03',
                            imei: 'IMEI123456',
                            status: 'active',
                            msisdn: '0501234567'
                        },
                        sim_data: {
                            locked_imei: 'IMEI123456',
                            lock_on_first_imei: true,
                            msisdn: '0501234567',
                            iccid: 'ICCID123456'
                        },
                        device_info: {
                            brand: 'Samsung',
                            model: 'Galaxy S21',
                            name: 'Test Device'
                        },
                        package_id: 100,
                        active: true
                    }
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock)
                    .mockResolvedValueOnce(searchResult)
                    .mockResolvedValueOnce(mobileResult)
                    .mockResolvedValueOnce(mobileInfoResult);

                await getAllUserData(req as Request, res as Response, next);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    simNumber: '1234567890',
                    endpoint_id: 67890,
                    domain_user_id: 12345,
                    network_connection: 'Pelephone',
                    data_usage_gb: 2.5,
                    max_data_gb: 10.0,
                    imei1: 'IMEI123456',
                    status: 'active',
                    imei_lock: 'Locked',
                    msisdn: '0501234567',
                    iccid: 'ICCID123456',
                    device_info: {
                        brand: 'Samsung',
                        model: 'Galaxy S21',
                        name: 'Test Device'
                    },
                    package_id: '100',
                    active: true
                });
            });

            it('should handle SIM number not found', async () => {
                req.body = { simNumber: '9999999999' };

                const searchError = {
                    message: 'SIM number not found.'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockRejectedValue(searchError);

                await getAllUserData(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith(searchError);
            });

            it('should handle no devices found for user', async () => {
                req.body = { simNumber: '1234567890' };

                const searchResult = {
                    error_code: 200,
                    data: [{
                        domain_user_id: '12345'
                    }]
                };

                const noDevicesError = {
                    message: 'No devices found for this user.'
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock)
                    .mockResolvedValueOnce(searchResult)
                    .mockRejectedValueOnce(noDevicesError);

                await getAllUserData(req as Request, res as Response, next);

                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'SIM number not found.'
                });
            });

            it('should handle missing domain_user_id', async () => {
                req.body = { simNumber: '1234567890' };

                // First mock the searchUsersData to return user without domain_user_id
                const searchResult = {
                    error_code: 200,
                    data: [{}] // Empty user object without domain_user_id
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock).mockResolvedValueOnce(searchResult);

                await getAllUserData(req as Request, res as Response, next);

                // According to the actual code, when searchUsersData returns empty user data,
                // it throws "SIM number not found." error, which gets caught and re-thrown as "Error searching for user data."
                expect(next).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Error searching for user data.'
                });
            });

            it('should handle missing endpoint_id', async () => {
                req.body = { simNumber: '1234567890' };

                const searchResult = {
                    error_code: 200,
                    data: [{ domain_user_id: '12345' }]
                };

                const mobileResult = {
                    error_code: 200,
                    data: [{}] // Empty mobile object without endpoint_id
                };

                (validateRequiredParams as jest.Mock).mockImplementation(() => {});
                (validateWidelyResult as jest.Mock).mockImplementation(() => {});
                (callingWidely as jest.Mock)
                    .mockResolvedValueOnce(searchResult)
                    .mockResolvedValueOnce(mobileResult);

                await getAllUserData(req as Request, res as Response, next);

                // According to the actual code, when getMobilesData returns empty mobile data,
                // it doesn't have endpoint_id, so mobile.endpoint_id is undefined
                // This gets caught as "No devices found for this user." which converts to "SIM number not found."
                expect(next).toHaveBeenCalledWith({
                    status: 404,
                    message: 'SIM number not found.'
                });
            });

        });
    });
});
