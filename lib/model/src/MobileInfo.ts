// Mobile device info types for Widely API responses

interface MobileInfo {
  domain_user_id: string | number;
  iccid: string;
  service_id?: string | number;
  package_id?: string | number;
  dids?: string[] | Array<{
    purchase_type: string;
    type: string;
    country: string;
    sms_to_mail?: string;
  }>;
  endpoint_id?: string;
  [key: string]: unknown;
}

export { MobileInfo };