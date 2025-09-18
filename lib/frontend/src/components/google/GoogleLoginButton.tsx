import React from "react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useGoogleRedirect } from "../../hooks/useGoogleRedirect";
import { GoogleSignInResult } from "../../services/googleAuthService";
import googleIcon from "../../assets/googleIcon.png";
import { t } from "i18next";
import CustomTypography from "../designComponent/Typography";
import {
  GoogleLoginButton as StyledGoogleLoginButton,
  GoogleLoginLoadingSpinner,
  GoogleLoginContent,
  GoogleLoginIcon
} from "./googleLoginStyles";

interface GoogleLoginButtonProps {
  onSuccess?: (result: GoogleSignInResult) => void;
  onError?: (error: Error & { code?: string; userMessage?: string }) => void;
  useRedirect?: boolean; // Option for mobile compatibility
  disabled?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  useRedirect = false,
  disabled = false
}) => {
  // Use our custom hooks
  const { isLoading, signIn, error } = useGoogleAuth({
    useRedirect,
    onSuccess,
    onError
  });

  // Handle redirect result for mobile flow
  useGoogleRedirect({
    enabled: useRedirect,
    onSuccess,
    onError
  });

  // Show error if there is one (always call useEffect)
  React.useEffect(() => {
    if (error && !onError) {
      // Only auto-alert if no error handler provided
      alert(error);
    }
  }, [error, onError]);

  return (
    <StyledGoogleLoginButton
      onClick={signIn}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      isDisabled={disabled}
    >
      {isLoading ? <LoadingContent /> : <GoogleContent />}
    </StyledGoogleLoginButton>
  );
};

// Separate component for loading state
const LoadingContent: React.FC = () => (
  <GoogleLoginContent>
    <GoogleLoginLoadingSpinner />
    <CustomTypography text={t('SigningIn')} variant="h3" weight="regular"/>
  </GoogleLoginContent>
);

// Separate component for Google logo and text
const GoogleContent: React.FC = () => (
  <GoogleLoginContent>
    <CustomTypography text={t('continueWithGoogle')} variant="h3" weight="regular"/>
    <GoogleLoginIcon 
      src={googleIcon} 
      alt="Google" 
      width="18" 
      height="18"
    />
  </GoogleLoginContent>
);

export default GoogleLoginButton;
