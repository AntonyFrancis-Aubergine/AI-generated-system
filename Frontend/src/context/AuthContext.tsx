import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthResponse, User } from "../types/auth";
import api from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to verify token validity
  const verifyToken = async (token: string) => {
    try {
      // Simple call to verify the token
      await api.get("/api/v1/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);

            // Set auth state immediately to prevent flicker
            setIsAuthenticated(true);
            setUser(parsedUser);

            console.log("User restored from localStorage:", parsedUser);
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (data: AuthResponse) => {
    console.log("AuthContext login called with:", data);

    if (!data || !data.token || !data.user) {
      console.error("Invalid auth data received:", data);
      return;
    }

    // Store auth data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Update state
    setIsAuthenticated(true);
    setUser(data.user);

    console.log("Login successful, user state updated:", data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
