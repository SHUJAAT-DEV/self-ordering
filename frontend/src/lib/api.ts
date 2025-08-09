import { config, getApiUrl } from './config';

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Get stored auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem(config.auth.tokenStorageKey);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Clear authentication data
export const clearAuth = (): void => {
  localStorage.removeItem(config.auth.tokenStorageKey);
  localStorage.removeItem(config.auth.userStorageKey);
};

// Base fetch function with common configuration
const baseFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const requestConfig: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.env.debug) {
    console.log('API Request:', { url, requestConfig });
  }

  const response = await fetch(url, requestConfig);

  if (config.env.debug) {
    console.log('API Response:', { status: response.status, url });
  }

  return response;
};

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await baseFetch(endpoint, options);

    // Handle authentication errors
    if (response.status === 401) {
      clearAuth();
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
      throw new ApiError(401, 'Authentication required');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new ApiError(response.status, errorMessage, response);
    }

    // Handle empty responses (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Network error. Please check your connection.');
    }

    throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
  }
};

// HTTP method functions
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return apiCall<T>(url, { method: 'GET' });
  },

  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE' });
  },

  // File upload function
  upload: async <T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return apiCall<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Specialized API functions for common operations
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post<{ access_token: string; user: any }>('auth/login', credentials),

  logout: () => {
    clearAuth();
    return Promise.resolve();
  },

  getCurrentUser: () => api.get<any>('auth/profile'),
};

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('admin/dashboard'),
  getAnalytics: (days?: number) => api.get('admin/analytics', days ? { days: days.toString() } : undefined),

  // Tables
  getTables: () => api.get('admin/tables'),
  createTable: (data: any) => api.post('admin/tables', data),
  updateTable: (id: number, data: any) => api.put(`admin/tables/${id}`, data),
  deleteTable: (id: number) => api.delete(`admin/tables/${id}`),

  // Customers
  getCustomers: (page = 1, limit = 50) => 
    api.get<PaginatedResponse<any>>('admin/customers', { page: page.toString(), limit: limit.toString() }),
  getCustomer: (id: number) => api.get(`admin/customers/${id}`),
  createCustomer: (data: any) => api.post('admin/customers', data),
  updateCustomer: (id: number, data: any) => api.put(`admin/customers/${id}`, data),
  deleteCustomer: (id: number) => api.delete(`admin/customers/${id}`),
  addLoyaltyPoints: (id: number, points: number) => 
    api.post(`admin/customers/${id}/add-loyalty-points`, { points }),

  // Users
  getUsers: () => api.get('admin/users'),
  createUser: (data: any) => api.post('admin/users', data),
  updateUser: (id: number, data: any) => api.put(`admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`admin/users/${id}`),

  // Orders
  getOrders: (params?: Record<string, string>) => 
    api.get<PaginatedResponse<any>>('admin/orders', params),

  // Menu
  getProducts: () => api.get('admin/products'),
  getCategories: () => api.get('admin/categories'),

  // System
  getSystemInfo: () => api.get('admin/system-info'),
  getDatabaseStats: () => api.get('admin/database-stats'),
};

// Export for backward compatibility
export default api;