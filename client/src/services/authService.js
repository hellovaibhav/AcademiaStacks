import axios from 'axios';
import Cookies from 'js-cookie';

// Configure axios defaults for secure cookie handling
axios.defaults.withCredentials = true;

class AuthService {
  constructor () {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    this.setupInterceptors();
  }

  setupInterceptors () {
    // Request interceptor to add authorization header
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Secure cookie configuration
  getCookieOptions () {
    return {
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'strict', // CSRF protection
      expires: 7 // 7 days
    };
  }

  getAccessToken () {
    return localStorage.getItem('access_token');
  }

  getRefreshToken () {
    return localStorage.getItem('refresh_token');
  }

  setTokens (accessToken, refreshToken) {
    // Store tokens in localStorage for client-side access
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }

    // Also set cookies for additional security (httpOnly)
    const options = this.getCookieOptions();
    Cookies.set('access_token', accessToken, options);
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, {...options, expires: 30}); // Refresh token for 30 days
    }
  }

  removeTokens () {
    // Remove from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Remove cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('email');
  }

  async login (credentials) {
    try {
      if (!this.apiBaseUrl) {
        throw new Error('API Base URL is not configured. Please check your .env file.');
      }

      const response = await axios.post(`${this.apiBaseUrl}/auth/login`, credentials);

      const {access_token: accessToken, refresh_token: refreshToken, user} = response.data;

      // Store tokens securely
      this.setTokens(accessToken, refreshToken);

      // Store user data in localStorage for app state
      localStorage.setItem('user', JSON.stringify(user));

      // Store email for quick access (used in upvoting)
      Cookies.set('email', user.email, this.getCookieOptions());

      return {success: true, user};
    } catch (error) {

      let errorMessage = 'Login failed';

      if (error.message.includes('API Base URL is not configured')) {
        errorMessage = 'API configuration error. Please check your environment setup.';
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the API server is running.';
      } else if (error.response?.status === 400) {
        // Wrong password or validation errors
        errorMessage = error.response.data?.message || 'Invalid email or password';
      } else if (error.response?.status === 401) {
        // User not verified
        errorMessage = error.response.data?.message || 'Account not verified. Please check your email for OTP verification.';
      } else if (error.response?.status === 404) {
        // User not found - show the exact server message
        errorMessage = error.response.data?.message || 'No account found with this email address';
      } else if (error.response?.status === 409) {
        errorMessage = error.response.data?.message || 'Account conflict';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async register (userData) {
    try {
      if (!this.apiBaseUrl) {
        throw new Error('API Base URL is not configured. Please check your .env file.');
      }

      const response = await axios.post(`${this.apiBaseUrl}/auth/register`, userData);

      // Store email for OTP verification
      Cookies.set('email', userData.email, this.getCookieOptions());

      return {success: true, data: response.data};
    } catch (error) {

      let errorMessage = 'Registration failed';

      if (error.message.includes('API Base URL is not configured')) {
        errorMessage = 'API configuration error. Please check your environment setup.';
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the API server is running.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Registration endpoint not found. Please check your API configuration.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many registration attempts. Please wait a few minutes and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async refreshToken () {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${this.apiBaseUrl}/auth/refresh`, {
        refreshToken
      });

      const {access_token: accessToken} = response.data;
      this.setTokens(accessToken, refreshToken); // Keep the same refresh token

      return {success: true};
    } catch (error) {
      this.removeTokens();
      throw error;
    }
  }

  async logout () {
    try {
      const refreshToken = this.getRefreshToken();

      if (refreshToken) {
        // Notify server to invalidate tokens
        await axios.post(`${this.apiBaseUrl}/auth/logout`, {
          refreshToken
        });
      }
    } catch (error) {
      // Logout error - continue with cleanup
    } finally {
      // Always clear client-side data
      this.removeTokens();
    }
  }

  async verifyOTP (otp) {
    try {
      const email = Cookies.get('email');
      const response = await axios.post(`${this.apiBaseUrl}/auth/verification`, {
        email,
        otp
      });

      return {success: true, data: response.data};
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'OTP verification failed'
      };
    }
  }

  async resendOTP (email) {
    try {
      if (!this.apiBaseUrl) {
        throw new Error('API Base URL is not configured. Please check your .env file.');
      }

      const response = await axios.post(`${this.apiBaseUrl}/auth/resend-otp`, {
        email
      });

      return {success: true, data: response.data};
    } catch (error) {

      let errorMessage = 'Failed to resend OTP';

      if (error.message.includes('API Base URL is not configured')) {
        errorMessage = 'API configuration error. Please check your environment setup.';
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the API server is running.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please register again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Invalid request';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a few minutes and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  isAuthenticated () {
    const token = this.getAccessToken();
    const user = localStorage.getItem('user');
    return Boolean(token && user);
  }

  getCurrentUser () {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;

