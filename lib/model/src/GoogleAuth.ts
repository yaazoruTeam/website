/**
 * to do:
 * 
 * TEMPORARY SOLUTION - Google Authentication Types
 * 
 * ⚠️ WARNING: This is a temporary implementation ⚠️
 * 
 * This file defines TypeScript interfaces for Google authentication integration.
 * These interfaces are designed to work with the current mock Firebase implementation
 * and will need to be validated/updated when real Firebase authentication is implemented.
 * 
 * CURRENT STATUS:
 * - Interfaces are defined but working with mock Firebase
 * - Backend integration may need adjustment
 * - Token handling is placeholder
 * 
 * TODO BEFORE PRODUCTION:
 * 1. Validate interfaces work with real Firebase auth
 * 2. Test backend authentication flow
 * 3. Verify token validation and security
 * 4. Update documentation with actual auth flow
 * 
 * @author Development Team
 * @date October 2025
 * @status TEMPORARY - VALIDATE WITH REAL FIREBASE
 */

export interface GoogleAuthParams {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  idToken: string
}

export interface BackendUser {
  user_id: string
  email: string
  user_name: string
  photo_url?: string
  role: string
}

export interface BackendAuthResult {
  success: boolean
  user: BackendUser
  token: string
}