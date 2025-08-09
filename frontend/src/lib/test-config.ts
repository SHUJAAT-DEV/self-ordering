import { config, getApiUrl, getApiBaseUrl, isDev, isProd } from './config';

// Test configuration
export const testConfig = () => {
  console.group('🔧 Frontend Configuration Test');
  
  console.log('📱 App Info:', {
    name: config.app.name,
    version: config.app.version,
  });

  console.log('🌐 API Configuration:', {
    baseUrl: config.api.baseUrl,
    version: config.api.version,
    timeout: config.api.timeout,
    fullBaseUrl: getApiBaseUrl(),
  });

  console.log('🔒 Auth Configuration:', {
    tokenStorageKey: config.auth.tokenStorageKey,
    userStorageKey: config.auth.userStorageKey,
  });

  console.log('🚀 Features:', config.features);

  console.log('📁 Upload Settings:', config.upload);

  console.log('🌍 Environment:', {
    isDevelopment: isDev(),
    isProduction: isProd(),
    debug: config.env.debug,
  });

  console.log('🔗 API URL Examples:', {
    auth: getApiUrl('auth/login'),
    dashboard: getApiUrl('admin/dashboard'),
    tables: getApiUrl('admin/tables'),
  });

  console.groupEnd();

  // Test environment variables
  const missingVars = [];
  if (!import.meta.env.VITE_API_BASE_URL) {
    missingVars.push('VITE_API_BASE_URL');
  }

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.log('💡 Make sure your .env file exists and contains all required variables');
  } else {
    console.log('✅ All required environment variables are set');
  }

  return {
    success: missingVars.length === 0,
    missingVariables: missingVars,
    config
  };
};

// Auto-run in development
if (isDev()) {
  testConfig();
}