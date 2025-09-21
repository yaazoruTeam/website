import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup, signInWithRedirect, getRedirectResult, User } from "firebase/auth";
import { googleAuth } from "../api/authApi";
import { t } from "i18next";
import { 
  GoogleAuthParams, 
  BackendUser, 
  BackendAuthResult 
} from "@model/GoogleAuth";
import {
  RedirectInProgressError,
  UserNotFoundError,
  FirebaseAuthError,
  BackendAuthError
} from "../utils/googleAuthErrors";

// Re-export types for convenience with proper Firebase User typing
export type { BackendUser, BackendAuthResult, GoogleAuthParams };
export interface GoogleSignInResult {
  firebaseUser: User; // Properly typed Firebase User
  backendResult?: BackendAuthResult;
  backendError?: Error;
}

export class GoogleAuthService {
  
  /**
   * Sign in with Google using popup (desktop) or redirect (mobile)
   */
  static async signInWithGoogle(useRedirect = false): Promise<GoogleSignInResult> {
    let result;
    
    try {
      if (useRedirect) {
        // Better for mobile devices
        await signInWithRedirect(auth, provider);
        throw new RedirectInProgressError(); // Special case - redirect will handle the rest
      } else {
        // Better for desktop
        result = await signInWithPopup(auth, provider);
      }

      const firebaseUser = result.user;
      
      if (!firebaseUser) {
        throw new FirebaseAuthError(new Error('No user returned from Google sign-in'));
      }

      console.log("✅ Google sign-in successful:", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid
      });

      // Authenticate with backend
      const { backendResult, backendError } = await this.authenticateWithBackend(firebaseUser);

      return {
        firebaseUser,
        backendResult,
        backendError
      };
    } catch (error: unknown) {
      // Re-throw our custom errors as-is
      if (error instanceof RedirectInProgressError || error instanceof FirebaseAuthError) {
        throw error;
      }
      
      // Wrap Firebase auth errors in our custom error
      throw new FirebaseAuthError(error as Error);
    }
  }

  /**
   * Handle redirect result after page reload (for mobile flow)
   */
  static async handleRedirectResult(): Promise<GoogleSignInResult | null> {
    const result = await getRedirectResult(auth);
    
    if (!result?.user) {
      return null;
    }

    const firebaseUser = result.user;
    const { backendResult, backendError } = await this.authenticateWithBackend(firebaseUser);

    return {
      firebaseUser,
      backendResult,
      backendError
    };
  }

  /**
   * Send user data to backend and handle authentication
   */
  private static async authenticateWithBackend(user: User): Promise<{
    backendResult?: BackendAuthResult;
    backendError?: Error;
  }> {
    try {
      if (!user.email) {
        throw new UserNotFoundError(user.email || 'unknown');
      }

      // Get Firebase ID Token for secure authentication
      console.log('🔑 Getting Firebase ID Token for secure authentication...');
      const idToken = await user.getIdToken();
      
      if (!idToken) {
        throw new FirebaseAuthError(new Error('Failed to get Firebase ID Token'));
      }

      const backendResult = await googleAuth({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        idToken: idToken
      });

      console.log("✅ Backend authentication successful:", backendResult);

      // Store JWT token for future requests
      if (backendResult.token) {
        this.storeAuthToken(backendResult.token);
        // Dispatch custom event to notify Header about successful auth
        window.dispatchEvent(new CustomEvent('userAuthUpdated', { 
          detail: { user: backendResult.user } 
        }));
      }

      return { backendResult };
      
    } catch (error) {
      console.error("❌ Backend authentication failed:", error);
      console.warn("⚠️ User authenticated with Google but backend sync failed");
      
      // Wrap backend errors appropriately
      if (error instanceof UserNotFoundError || error instanceof FirebaseAuthError) {
        return { backendError: error };
      }
      
      const backendError = new BackendAuthError(error as Error & { status?: number });
      return { backendError };
    }
  }

  /**
   * Store authentication tokens in localStorage
   */
  private static storeAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get user-friendly error message for Firebase Auth errors
   */
  static getErrorMessage(error: { code?: string; message?: string; status?: number }): string {
    // Handle our custom error codes first
    switch (error.code) {
      case 'REDIRECT_IN_PROGRESS':
        return ''; // Not really an error
      case 'USER_NOT_FOUND':
        return t('googleAuthErrors.accessDenied');
      case 'FIREBASE_AUTH_ERROR':
      case 'BACKEND_AUTH_ERROR':
        return error.message || t('googleAuthErrors.generalError');
    }
    
    // Handle backend authentication errors
    if (error.status === 403) {
      return t('googleAuthErrors.accessDenied');
    }
    
    if (error.status === 401) {
      return t('googleAuthErrors.authenticationError');
    }

    // Handle Firebase Auth errors
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return t('googleAuthErrors.popupClosedByUser');
      case 'auth/popup-blocked':
        return t('googleAuthErrors.popupBlocked');
      case 'auth/network-request-failed':
        return t('googleAuthErrors.networkRequestFailed');
      case 'auth/too-many-requests':
        return t('googleAuthErrors.tooManyRequests');
      default:
        return error.message || t('googleAuthErrors.generalError');
    }
  }
}