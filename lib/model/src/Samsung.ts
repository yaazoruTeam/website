/**
 * Samsung Device Types
 * Re-exported from backend Samsung integration for use across the application
 */

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
  rebootStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
  installAppStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
  applyProfileStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
  caStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
  apnStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
  domainFilterStatus?: 'Ok' | 'Pending' | 'Error' | 'Unknown';
}

export interface MoveGroupRequest {
  groupId: number;
}

export interface MoveGroupResponse {
  message: string;
}

export interface SyncDeviceRequest {
  forceSync?: boolean;
}

export interface SyncDeviceResponse {
  result: string;
}

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

export interface GroupsList {
  groups: GroupInfo[];
}

export interface ErrorResponse {
  errorMessage: string;
}
