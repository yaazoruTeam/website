// Custom error classes for Google Authentication
// Provides type-safe and robust error handling

/**
 * Base class for Google Auth errors
 */
export abstract class GoogleAuthError extends Error {
  abstract readonly code: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when user is not found in our database
 */
export class UserNotFoundError extends GoogleAuthError {
  readonly code = 'USER_NOT_FOUND';
  
  constructor(email: string) {
    super(`User with email ${email} is not authorized to access this system`);
  }
}

/**
 * Error thrown when Firebase authentication fails
 */
export class FirebaseAuthError extends GoogleAuthError {
  readonly code = 'FIREBASE_AUTH_ERROR';
  readonly originalError: Error;
  
  constructor(originalError: Error) {
    super(`Firebase authentication failed: ${originalError.message}`);
    this.originalError = originalError;
  }
}

/**
 * Error thrown when backend authentication fails
 */
export class BackendAuthError extends GoogleAuthError {
  readonly code = 'BACKEND_AUTH_ERROR';
  readonly status?: number;
  readonly originalError: Error;
  
  constructor(originalError: Error & { status?: number }) {
    super(`Backend authentication failed: ${originalError.message}`);
    this.originalError = originalError;
    this.status = originalError.status;
  }
}

/**
 * Type guard to check if error is a GoogleAuthError
 */
export function isGoogleAuthError(error: unknown): error is GoogleAuthError {
  return error instanceof GoogleAuthError;
}

/**
 * Type guard to check if error is UserNotFoundError
 */
export function isUserNotFoundError(error: unknown): error is UserNotFoundError {
  return error instanceof UserNotFoundError;
}