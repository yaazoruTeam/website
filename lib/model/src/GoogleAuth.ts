/**
 * Firebase user data that we receive from Google OAuth
 */
export interface GoogleAuthParams {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  idToken: string;
}

/**
 * Backend user data returned after successful authentication
 */
export interface BackendUser {
  user_id: string;
  email: string;
  user_name: string;
  photo_url?: string;
  role: string;
}

/**
 * Backend authentication response
 */
export interface BackendAuthResult {
  success: boolean;
  user: BackendUser;
  token: string;
}

/**
 * Complete Google sign-in result containing both Firebase and backend data
 * Note: firebaseUser type will be imported from firebase/auth in the service layer
 */
export interface GoogleSignInResult {
  firebaseUser: any; // Will be typed as Firebase User in the service layer
  backendResult?: BackendAuthResult;
  backendError?: Error;
}

/**
 * Google Auth error with additional context
 */
export interface GoogleAuthError extends Error {
  code?: string;
  status?: number;
  userMessage?: string;
}

/**
 * Namespace for Google Auth types
 */
export namespace GoogleAuth {
  export type Params = GoogleAuthParams;
  export type User = BackendUser;
  export type Result = BackendAuthResult;
  export type SignInResult = GoogleSignInResult;
  export type AuthError = GoogleAuthError;
}