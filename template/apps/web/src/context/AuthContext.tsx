import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, LoginRequest } from "../types";
import { authApi } from "../utils/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const user = await authApi.getProfile();
        if (mounted) dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch {
        if (mounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    const isAdminPath = window.location.pathname === "/admin";
    if (!isAdminPath) check();
    else dispatch({ type: "SET_LOADING", payload: false });
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await authApi.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
    } catch {
      dispatch({ type: "LOGIN_FAILURE" });
      throw new Error("Login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    isAdmin: state.user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
