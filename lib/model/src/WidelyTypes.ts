// Type definitions for Widely API responses and user data structures

export interface WidelyUserData {
  domain_user_id?: number;
  domain_user_name?: string;
  name?: string;
  endpoint_id?: string | number;
  // Add other fields as needed
}

export interface WidelyCreationResult {
  data?: Array<{
    endpoint_id?: string | number;
    // Add other fields as needed
  }>;
}

export interface WidelyMobileInfo {
  domain_user_id?: number;
  iccid?: string;
  service_id?: number;
  package_id?: number;
  dids?: unknown;
  sim_data?: {
    msisdn?: string;
    iccid?: string;
    locked_imei?: string;
    lock_on_first_imei?: boolean;
  };
  registration_info?: {
    msisdn?: string;
    imei?: string;
    status?: string;
    mcc_mnc?: string;
  };
  device_info?: {
    brand?: string;
    model?: string;
    name?: string;
  };
  subscriptions?: Array<{
    data?: Array<{
      usage?: number;
    }>;
  }>;
  data_used?: number;
  data_limit?: number;
  active?: boolean;
}