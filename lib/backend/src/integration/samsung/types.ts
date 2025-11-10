/**
 * Samsung API Types and Interfaces
 * Based on yaazoru-api.yaml OpenAPI specification
 */

// Device Information Types
export interface DeviceInfo {
    groupID: number;
    groupName: string;
    androidID: string;
    deviceStatus: 'Registering' | 'Active' | 'Wiped' | 'Unknown';
    lastConnected: number;
    registeredOn: number;
    serialNumber: string;
    currentSim: string;
    imei1: string;
    imei2: string;
    friendlyName: string;
    locationLat: string;
    locationLon: string;
    locationTimeStamp: number;
    deviceModel: string;
    clientAppVersion: string;
    batteryLevel: string;
    cellularStrength: string;
    networkID: string;
    availableStorage: string;
    androidVer: string;
    SdkVer: string;
}

// Move Device to Group Request
export interface MoveGroupRequest {
    groupId: number;
}

// Move Device to Group Response
export interface MoveGroupResponse {
    message: string;
}

// Sync Device Request
export interface SyncDeviceRequest {
    forceSync?: boolean;
}

// Sync Device Response
export interface SyncDeviceResponse {
    result: string;
}

// Group Information Types
export interface GroupInfo {
    groupID: number;
    groupName: string;
    description: string;
    createTime: number;
    token: string;
    techniciankey: string;
    wallPaperName: string;
    groupCapacity: number;
    languageCode: string;
    countryCode: string;
    forceRoaming: boolean;
}

// Groups List Response
export interface GroupsList {
    groups: GroupInfo[];
}

// Error Response
export interface ErrorResponse {
    errorMessage: string;
}

// API Response wrapper for Axios responses
export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
