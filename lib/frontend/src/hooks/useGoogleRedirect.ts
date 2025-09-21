import { useEffect } from 'react';
import { GoogleAuthService, GoogleSignInResult } from '../services/googleAuthService';

interface UseGoogleRedirectOptions {
  enabled: boolean;
  onSuccess?: (result: GoogleSignInResult) => void;
  onError?: (error: Error) => void;
}

export const useGoogleRedirect = ({ 
  enabled, 
  onSuccess, 
  onError 
}: UseGoogleRedirectOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleRedirectResult = async () => {
      try {
        const result = await GoogleAuthService.handleRedirectResult();
        
        if (result && onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    handleRedirectResult();
  }, [enabled, onSuccess, onError]);
};