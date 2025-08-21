// Type-safe validation helpers to replace any usage

// Type guard for string values
const isString = (value: unknown): value is string => 
  typeof value === 'string';

// Type guard for non-empty string values
const isNonEmptyString = (value: unknown): value is string => 
  typeof value === 'string' && value.trim() !== '';

// Type guard for optional string values (undefined or non-empty string)
const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || (typeof value === 'string' && value.trim() !== '');

// Type guard for optional non-empty string values
const isOptionalNonEmptyString = (value: unknown): value is string | undefined =>
  value === undefined || isNonEmptyString(value);

// Type guard for number values
const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value);

// Type guard for boolean values
const isBoolean = (value: unknown): value is boolean => 
  typeof value === 'boolean';

// Type guard for Date values
const isDate = (value: unknown): value is Date => 
  value instanceof Date && !isNaN(value.getTime());

// Type guard for object values
const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Type guard for array values
const isArray = (value: unknown): value is unknown[] => 
  Array.isArray(value);

export {
  isString,
  isNonEmptyString,
  isOptionalString,
  isOptionalNonEmptyString,
  isNumber,
  isBoolean,
  isDate,
  isObject,
  isArray
};