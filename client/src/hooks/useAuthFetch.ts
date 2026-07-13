import { useCallback } from 'react';
import { getCurrentUser, refreshAccessToken } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/getApiUrl';

const API_URL = getApiUrl();

// useAuthFetch returns a fetch-like function for protected API requests.
// It automatically attaches the current access token from AuthContext.
// If the request fails with 401, it tries to refresh the access token using
// the httpOnly refresh-token cookie, updates AuthContext, and retries the
// original request once. If refresh fails, it clears auth so route guards can
// redirect the user to login.

// authFetch has the same basic shape as fetch:
// pass the API path plus normal fetch options like method, headers, and body.
// Example:
// authFetch('/documents/text', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ title, content }),
// });

export function useAuthFetch() {
  const { accessToken, setAuth, clearAuth } = useAuth();

  const authFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      // Small helper so the first request and the retry request are built
      // the same way, just with a different access token.
      const makeRequest = (token: string) => {
        const headers = new Headers(options.headers);

        // Always attach the current access token to protected API requests.
        // Any custom headers passed in options are preserved above.
        headers.set('Authorization', `Bearer ${token}`);

        return fetch(`${API_URL}${path}`, {
          ...options,
          headers,
        });
      };

      // First try the request with the access token currently stored in memory.
      let response = await makeRequest(accessToken);

      // If the request did not fail because of auth, return it normally.
      // The API function that called authFetch can handle other errors like 400/500.
      if (response.status !== 401) {
        return response;
      }

      try {
        // A 401 usually means the access token expired.
        // Ask the backend for a new access token using the httpOnly refresh cookie.
        const newAccessToken = await refreshAccessToken();

        // Fetch the current user with the new access token so AuthContext stays complete.
        const user = await getCurrentUser(newAccessToken);

        // Save the fresh token and user in memory.
        setAuth({
          user,
          accessToken: newAccessToken,
        });

        // Retry the original request once with the new access token.
        response = await makeRequest(newAccessToken);

        // If it still fails with 401 after refresh, the session is no longer valid.
        if (response.status === 401) {
          clearAuth();
          throw new Error('Unauthorized');
        }

        return response;
      } catch {
        // If refresh fails, clear auth so ProtectedRoute can redirect to login.
        clearAuth();
        throw new Error('Your session expired. Please log in again.');
      }
    },
    [accessToken, setAuth, clearAuth],
  );

  return authFetch;
}
