import { useState } from 'react';
import { GoogleAuthService, GoogleSignInResult, AuthFlowResult } from '../services/googleAuthService';
import { isGoogleAuthError } from '../utils/googleAuthErrors';

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
    
    const result: AuthFlowResult = await GoogleAuthService.signInWithGoogle(useRedirect);
    
    switch (result.type) {
      case 'SUCCESS':
        // Call success callback
        if (onSuccess) {
          onSuccess(result.data);
        }
        break;
        
      case 'REDIRECT_IN_PROGRESS':
        // This is normal - redirect will handle the rest
        console.log('🔄 ' + result.message);
        return; // Don't set loading to false - redirect will reload page
        
      case 'ERROR':
        console.error("❌ Error during Google sign-in:", result.error);
        
        // Handle our custom Google Auth errors with proper typing
        if (isGoogleAuthError(result.error)) {
          const userMessage = GoogleAuthService.getErrorMessage({ 
            code: result.error.code, 
            message: result.error.message 
          });
          const errorWithMessage = { 
            ...result.error, 
            userMessage 
          };
          
          setError(userMessage);
          
          if (onError) {
            onError(errorWithMessage);
          }
        } else {
          // Handle other errors
          const userMessage = GoogleAuthService.getErrorMessage(result.error);
          const errorWithMessage = { 
            ...result.error, 
            userMessage 
          };
          
          setError(userMessage);
          if (onError) {
            onError(errorWithMessage);
          }
        }
        break;
    }
    
    setIsLoading(false);
  };

  return {
    isLoading,
    signIn,
    error,
  };
};