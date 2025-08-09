import { config, getApiUrl } from './config';

interface HealthCheckResult {
  frontend: {
    status: 'ok' | 'error';
    config: any;
    timestamp: string;
  };
  backend: {
    status: 'ok' | 'error' | 'unreachable';
    response?: any;
    error?: string;
    timestamp: string;
  };
}

export const performHealthCheck = async (): Promise<HealthCheckResult> => {
  const result: HealthCheckResult = {
    frontend: {
      status: 'ok',
      config: {
        apiBaseUrl: config.api.baseUrl,
        apiVersion: config.api.version,
        environment: config.env.isDevelopment ? 'development' : 'production',
        features: config.features
      },
      timestamp: new Date().toISOString()
    },
    backend: {
      status: 'error',
      timestamp: new Date().toISOString()
    }
  };

  // Test backend connectivity
  try {
    const healthUrl = getApiUrl('health');
    const response = await fetch(healthUrl, {
      method: 'GET',
      timeout: 5000
    } as RequestInit);

    if (response.ok) {
      result.backend.status = 'ok';
      try {
        result.backend.response = await response.json();
      } catch {
        result.backend.response = 'OK';
      }
    } else {
      result.backend.status = 'error';
      result.backend.error = `HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (error) {
    result.backend.status = 'unreachable';
    result.backend.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
};

// Console-friendly health check
export const logHealthCheck = async () => {
  console.group('🏥 System Health Check');
  
  const health = await performHealthCheck();
  
  console.log('🖥️ Frontend Status:', health.frontend.status === 'ok' ? '✅ OK' : '❌ ERROR');
  console.log('📊 Frontend Config:', health.frontend.config);
  
  console.log('🔗 Backend Status:', 
    health.backend.status === 'ok' ? '✅ Connected' : 
    health.backend.status === 'unreachable' ? '🚫 Unreachable' : 
    '❌ Error'
  );
  
  if (health.backend.error) {
    console.log('⚠️ Backend Error:', health.backend.error);
  }
  
  if (health.backend.response) {
    console.log('📡 Backend Response:', health.backend.response);
  }

  console.groupEnd();
  
  return health;
};

// Auto-run health check in development
if (config.env.isDevelopment && config.env.debug) {
  setTimeout(() => {
    logHealthCheck();
  }, 1000);
}