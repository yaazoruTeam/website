// Excel row data structure for customer device imports

interface ExcelRowData {
  first_name?: string;
  last_name?: string;
  id_number?: string;
  phone_number?: string;
  email?: string;
  city?: string;
  address1?: string;
  device_number?: string;
  SIM_number?: string;
  IMEI_1?: string;
  mehalcha_number?: string;
  model?: string;
  receivedAt?: string | number | Date;
  [key: string]: unknown; // Allow additional columns
}

interface ProcessingError {
  row: ExcelRowData;
  error: string;
  rowIndex?: number;
}

export { ExcelRowData, ProcessingError };