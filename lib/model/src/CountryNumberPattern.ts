/**
 * Country number patterns for phone number extraction
 * Used for parsing phone numbers from API responses based on country codes
 */

export interface CountryNumberPattern {
  code: string
  pattern: RegExp
  description: string
}

// Country-specific number patterns for phone number extraction
export const COUNTRY_PATTERNS: CountryNumberPattern[] = [
  {
    code: 'IL',
    pattern: /972\d{9}/g,
    description: 'Israeli numbers (972 + 9 digits)'
  },
  {
    code: 'US',
    pattern: /1\d{10}/g,
    description: 'US numbers (1 + 10 digits)'
  },
  {
    code: 'GB',
    pattern: /44\d{10,11}/g,
    description: 'UK numbers (44 + 10-11 digits)'
  },
  {
    code: 'DE',
    pattern: /49\d{10,12}/g,
    description: 'German numbers (49 + 10-12 digits)'
  },
  {
    code: 'FR',
    pattern: /33\d{9}/g,
    description: 'French numbers (33 + 9 digits)'
  }
]

/**
 * Get available country patterns for debugging/testing
 */
export function getAvailableCountryPatterns(): CountryNumberPattern[] {
  return COUNTRY_PATTERNS
}

/**
 * Test if a string matches a phone number pattern for a specific country
 */
export function testCountryPattern(text: string, countryCode: string): boolean {
  const pattern = COUNTRY_PATTERNS.find(p => p.code === countryCode)
  if (!pattern) return false
  
  return pattern.pattern.test(text)
}