import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ensureUserExists } from '../services/api';

/**
 * Custom hook to synchronize Auth0 user with Kendall's Nails API
 * Automatically checks if user exists and creates them if needed after login
 */
export const useUserSync = () => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [syncStatus, setSyncStatus] = useState({
    loading: false,
    error: null,
    user: null,
    synced: false,
  });

  useEffect(() => {
    const syncUser = async () => {
      // Only sync if user is authenticated and not already synced
      if (!isAuthenticated || isLoading || syncStatus.synced) {
        return;
      }

      setSyncStatus((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Get access token with the correct audience
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://nails-api.kendall-kelly.com/',
          },
        });

        // Ensure user exists in our API (check and create if needed)
        const user = await ensureUserExists(accessToken);

        setSyncStatus({
          loading: false,
          error: null,
          user,
          synced: true,
        });
      } catch (error) {
        console.error('Error syncing user:', error);
        setSyncStatus({
          loading: false,
          error: error.message,
          user: null,
          synced: false,
        });
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, syncStatus.synced, getAccessTokenSilently]);

  return syncStatus;
};
