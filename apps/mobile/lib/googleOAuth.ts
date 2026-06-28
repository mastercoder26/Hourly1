import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/expo';

export type GoogleOAuthRole = 'student' | 'organizer';

export function useGoogleOAuth() {
  const { startSSOFlow } = useSSO();

  const signInWithGoogle = async (options?: { role?: GoogleOAuthRole }) => {
    const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'hourly' });
    return startSSOFlow({
      strategy: 'oauth_google',
      redirectUrl,
      ...(options?.role ? { unsafeMetadata: { role: options.role } } : {}),
    });
  };

  return { signInWithGoogle };
}
