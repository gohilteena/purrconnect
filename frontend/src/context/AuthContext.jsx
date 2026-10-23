import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, getMe as apiGetMe } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate session on initial application mount
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await apiGetMe();
        if (isMounted) {
          if (response?.data?.user) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        }
      } catch (err) {
        if (isMounted) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiLogin({ email, password });
      const { token: receivedToken, user: receivedUser } = response.data || {};

      if (!receivedToken || !receivedUser) {
        throw new Error("Invalid response format from authentication server");
      }

      // Check admin authorization
      if (receivedUser.role !== "admin") {
        throw new Error("Access denied. Admin account privileges are required.");
      }

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);

      return receivedUser;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
