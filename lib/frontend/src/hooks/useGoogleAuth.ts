import { useState } from 'react';
import { GoogleAuthService, GoogleSignInResult } from '../services/googleAuthService';
import { isRedirectInProgressError, isGoogleAuthError } from '../utils/googleAuthErrors';

interface UseGoogleAuthOptions {
  useRedirect?: boolean;
  onSuccess?: (result: GoogleSignInResult) => void;
  onError?: (error: Error & { code?: string; userMessage?: string }) => void;
}

interface UseGoogleAuthReturn {
  isLoading: boolean;
  signIn: () => Promise<void>;
  error: string | null;
}

export const useGoogleAuth = ({
  useRedirect = false,
  onSuccess,
  onError
}: UseGoogleAuthOptions = {}): UseGoogleAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await GoogleAuthService.signInWithGoogle(useRedirect);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (err: unknown) {
      // Skip error handling for redirect (it's not really an error)
      if (isRedirectInProgressError(err)) {
        return;
      }
      
      console.error("❌ Error during Google sign-in:", err);
      
      // Handle our custom Google Auth errors with proper typing
      if (isGoogleAuthError(err)) {
        const userMessage = GoogleAuthService.getErrorMessage({ 
          code: err.code, 
          message: err.message 
        });
        const errorWithMessage = { 
          ...err, 
          userMessage 
        };
        
        setError(userMessage);
        
        if (onError) {
          onError(errorWithMessage);
        }
        return;
      }
      
      // Handle other errors
      const authError = err as Error & { code?: string };
      const userMessage = GoogleAuthService.getErrorMessage(authError);
      const errorWithMessage = { 
        ...authError, 
        userMessage 
      };
      
      setError(userMessage);
      if (onError) {onError(errorWithMessage);}
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    error,
  };
};