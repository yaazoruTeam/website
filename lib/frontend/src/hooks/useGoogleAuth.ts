import { useState, useCallback } from 'react';
import { GoogleAuthService, GoogleSignInResult } from '../services/googleAuthService';

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

  const signIn = useCallback(async () => {
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
      const authError = err as Error & { code?: string };
      
      // Skip error handling for redirect (it's not really an error)
      if (authError.message === 'REDIRECT_IN_PROGRESS') {
        return;
      }
      
      console.error("❌ Error during Google sign-in:", authError);
      
      const userMessage = GoogleAuthService.getErrorMessage(authError);
      const errorWithMessage = { 
        ...authError, 
        userMessage 
      };
      
      setError(userMessage);
      
      // Call error callback if provided
      if (onError) {
        onError(errorWithMessage);
      }
      
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, useRedirect, onSuccess, onError]);

  return {
    isLoading,
    signIn,
    error,
  };
};