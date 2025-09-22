import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import authService from "../services/authService";
import { toast } from 'react-toastify';

const INITIAL_STATE = {
    user: authService.getCurrentUser(),
    loading: false,
    error: null,
    isAuthenticated: authService.isAuthenticated(),
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
        case "REGISTER_START":
        case "LOGOUT_START":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: null,
                isAuthenticated: true,
            };
        case "REGISTER_SUCCESS":
            return {
                ...state,
                loading: false,
                error: null,
            };
        case "LOGIN_FAILURE":
        case "REGISTER_FAILURE":
            return {
                user: null,
                loading: false,
                error: action.payload,
                isAuthenticated: false,
            };
        case "LOGOUT_SUCCESS":
            return {
                user: null,
                loading: false,
                error: null,
                isAuthenticated: false,
            };
        case "CLEAR_ERROR":
            return {
                ...state,
                error: null,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    // Auto-check authentication status on app load
    useEffect(() => {
        const checkAuthStatus = () => {
            const isAuthenticated = authService.isAuthenticated();
            const user = authService.getCurrentUser();
            
            if (isAuthenticated && user) {
                dispatch({ type: "SET_USER", payload: user });
            } else if (state.isAuthenticated) {
                // User was authenticated but tokens are invalid
                dispatch({ type: "LOGOUT_SUCCESS" });
            }
        };

        checkAuthStatus();
    }, [state.isAuthenticated]);

    // Login function
    const login = useCallback(async (credentials) => {
        dispatch({ type: "LOGIN_START" });
        
        try {
            const result = await authService.login(credentials);
            
            if (result.success) {
                dispatch({ type: "LOGIN_SUCCESS", payload: result.user });
                toast.success(`Welcome back, ${result.user.fname}!`);
                return { success: true };
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: result.error });
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = error.message || "Login failed";
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        dispatch({ type: "REGISTER_START" });
        
        try {
            const result = await authService.register(userData);
            
            if (result.success) {
                dispatch({ type: "REGISTER_SUCCESS" });
                toast.success("Registration successful! Please verify your email.");
                return { success: true };
            } else {
                dispatch({ type: "REGISTER_FAILURE", payload: result.error });
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = error.message || "Registration failed";
            dispatch({ type: "REGISTER_FAILURE", payload: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        dispatch({ type: "LOGOUT_START" });
        
        try {
            await authService.logout();
            dispatch({ type: "LOGOUT_SUCCESS" });
            toast.success("Logged out successfully");
            return { success: true };
        } catch (error) {
            // Even if logout fails on server, clear client state
            dispatch({ type: "LOGOUT_SUCCESS" });
            toast.warning("Logged out (some cleanup may have failed)");
            return { success: true };
        }
    }, []);

    // Verify OTP function
    const verifyOTP = useCallback(async (otp) => {
        dispatch({ type: "LOGIN_START" });
        
        try {
            const result = await authService.verifyOTP(otp);
            
            if (result.success) {
                toast.success("Email verified successfully!");
                return { success: true };
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: result.error });
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = error.message || "OTP verification failed";
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    // Clear error function
    const clearError = useCallback(() => {
        dispatch({ type: "CLEAR_ERROR" });
    }, []);

    const contextValue = {
        user: state.user,
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        login,
        register,
        logout,
        verifyOTP,
        clearError,
        // Legacy dispatch for backward compatibility
        dispatch,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};