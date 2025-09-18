import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup, signInWithRedirect, getRedirectResult, User } from "firebase/auth";
import { googleAuth } from "../api/authApi";
import { t } from "i18next";
import { 
  GoogleAuthParams, 
  BackendUser, 
  BackendAuthResult 
} from "@model/GoogleAuth";

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
    
    if (useRedirect) {
      // Better for mobile devices
      await signInWithRedirect(auth, provider);
      throw new Error('REDIRECT_IN_PROGRESS'); // Special case - redirect will handle the rest
    } else {
      // Better for desktop
      result = await signInWithPopup(auth, provider);
    }

    const firebaseUser = result.user;
    
    if (!firebaseUser) {
      throw new Error('No user returned from Google sign-in');
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
        throw new Error('User email is required but not provided by Google');
      }

      // Get Firebase ID Token for secure authentication
      console.log('🔑 Getting Firebase ID Token for secure authentication...');
      const idToken = await user.getIdToken();
      
      if (!idToken) {
        throw new Error('Failed to get Firebase ID Token');
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
      
    } catch (backendError) {
      console.error("❌ Backend authentication failed:", backendError);
      console.warn("⚠️ User authenticated with Google but backend sync failed");
      return { backendError: backendError as Error };
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