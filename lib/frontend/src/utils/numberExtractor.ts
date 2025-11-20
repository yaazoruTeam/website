/**
 * Utility functions for extracting phone numbers from WIDELY API response messages
 */

import { CountryNumberPatternType, CountryNumberPattern, Widely } from '@model'

// Generic pattern for fallback
const GENERIC_PATTERN = /\d{8,15}/g

/**
 * Extract phone number from WIDELY API response note text
 * @param noteText - The text from the API response notes array
 * @param countryCode - ISO2 country code (e.g., 'IL', 'US')
 * @returns Extracted phone number or null if not found
 */
export function extractPhoneNumber(noteText: string, countryCode: string): string | null {
  if (!noteText || typeof noteText !== 'string') {
    return null
  }

  // Find the pattern for the specific country
  const countryPattern = CountryNumberPattern.COUNTRY_PATTERNS.find(pattern => pattern.code === countryCode)
  
  if (countryPattern) {    
    const matches = noteText.match(countryPattern.pattern)
    if (matches && matches.length > 0) {
      return matches[0]
    }
  }

  // Fallback to generic pattern
  const genericMatches = noteText.match(GENERIC_PATTERN)
  
  if (genericMatches && genericMatches.length > 0) {
    // Filter out sequences that are too short to be phone numbers
    const validNumbers = genericMatches.filter(num => num.length >= 10)
    
    if (validNumbers.length > 0) {
      return validNumbers[0]
    }
  }

  return null
}

/**
 * Extract phone number from WIDELY API response
 * @param response - The WIDELY API response object
 * @param countryCode - ISO2 country code
 * @returns Extracted phone number or null
 */
export function extractNumberFromWidelyResponse(
  response: Widely.Model, 
  countryCode: string
): string | null {
  if (!response || response.error_code !== 200) {
    return null
  }

  if (!response.data || typeof response.data !== 'object' || Array.isArray(response.data)) {
    return null
  }

  if (!('notes' in response.data) || !Array.isArray(response.data.notes)) {
    return null
  }

  if (response.data.notes.length === 0) {
    return null
  }

  const noteText = response.data.notes[0]
  return extractPhoneNumber(noteText, countryCode)
}

/**
 * Get available country patterns for debugging/testing
 */
export function getAvailableCountryPatterns(): CountryNumberPatternType[] {
  return CountryNumberPattern.getAvailableCountryPatterns()
}

/**
 * Test if a string matches a phone number pattern for a specific country
 */
export function testCountryPattern(text: string, countryCode: string): boolean {
  return CountryNumberPattern.testCountryPattern(text, countryCode)
}