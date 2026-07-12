import axios from "axios";

/**
 * Axios instance for all API calls.
 *
 * - Attaches the JWT from localStorage as a Bearer token on every request.
 * - On a 401 response, clears stored auth state and broadcasts a
 *   `session-expired` event so the AuthContext can redirect to /login.
 *
 * This mirrors the Spring Boot frontend's axios interceptor behaviour.
 */

const TOKEN_KEY = "transitops.token";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach JWT to every outgoing request.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — session expired / invalid token.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      // Don't trigger a redirect loop on the login page itself.
      if (path !== "/login") {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem("transitops.user");
        window.dispatchEvent(new CustomEvent("transitops:session-expired"));
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
