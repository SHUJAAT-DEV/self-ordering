// Environment configuration
export const config = {
  // App Information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Restaurant Self-Ordering System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: 30000, // 30 seconds
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
    isProduction: import.meta.env.VITE_NODE_ENV === 'production',
    debug: import.meta.env.VITE_DEBUG === 'true',
  },

  // Authentication
  auth: {
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'admin_token',
    userStorageKey: import.meta.env.VITE_USER_STORAGE_KEY || 'admin_user',
    tokenExpirationBuffer: 5 * 60 * 1000, // 5 minutes buffer
  },

  // Features
  features: {
    enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
    enableOffline: import.meta.env.VITE_ENABLE_OFFLINE === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  },

  // Upload Settings
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  },

  // Logging
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
    enableConsole: import.meta.env.VITE_DEBUG === 'true',
  },
} as const;

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  const version = config.api.version;
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  
  return `${baseUrl}/api/${version}/${cleanEndpoint}`;
};

// Helper function to get full API base URL
export const getApiBaseUrl = () => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, '');
  return `${baseUrl}/api/${config.api.version}`;
};

// Development helpers
export const isDev = () => config.env.isDevelopment;
export const isProd = () => config.env.isProduction;
export const isDebug = () => config.env.debug;