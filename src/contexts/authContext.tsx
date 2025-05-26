import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";

import axiosInstance from "@/api/axiosInstance";

interface User {
  username: string;
  roles: string[];
}

type AuthState = User | null;

type AuthAction = { type: "SET_USER"; payload: User } | { type: "CLEAR_USER" };

const initialAuthState: AuthState = null;

// Reducer function
const authReducer = (_state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return null;
  }
};

// Create context
export const AuthContext = createContext<{
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    username: string,
    password: string,
    roles: string[]
  ) => Promise<void>;
  isLording: boolean;
  setIsLording: React.Dispatch<React.SetStateAction<boolean>>;
}>(null!);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
  const [isLording, setIsLording] = useState(true);

  useEffect(() => {
    setIsLording(true);
    axiosInstance
      .get("/auth/user")
      .then(({ data }) => {
        const { username, roles } = data;
        dispatch({ type: "SET_USER", payload: { username, roles } });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error.message);
      })
      .finally(() => {
        setIsLording(false);
      });
  }, []);

  // Login function
  const login = async (userNameOrEmail: string, password: string) => {
    setIsLording(true);
    try {
      const response = await axiosInstance.post("/auth/signin", {
        userNameOrEmail,
        password,
      });
      const { username: user, roles } = response.data;
      dispatch({ type: "SET_USER", payload: { username: user, roles } });
    } catch (error: any) {
      console.error("Login failed", error);
      throw error.response?.data?.message || "Invalid credentials";
    } finally {
      setIsLording(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLording(true);
    try {
      await axiosInstance.post("/auth/signout", {});
      dispatch({ type: "CLEAR_USER" });
    } catch (error: any) {
      console.error("Logout failed", error);
      throw error.response?.data?.error || "Logout error";
    } finally {
      setIsLording(false);
    }
  };

  // Signup function
  const signup = async (
    username: string,
    password: string,
    roles: string[]
  ) => {
    try {
      await axiosInstance.post("/auth/signup", {
        username,
        password,
        roles,
      });
    } catch (error: any) {
      console.error("Signup failed", error);
      throw error.response?.data?.message || "Signup error";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        signup,
        isLording,
        setIsLording,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
