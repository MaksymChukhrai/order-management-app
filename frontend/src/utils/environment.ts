// src/utils/environment.ts
export const getEnv = (key: string, defaultValue: string = ''): string => {
    if (typeof window !== 'undefined' && window.import && window.import.meta && window.import.meta.env) {
      return window.import.meta.env[key] || defaultValue;
    }
    
    // Для тестов возвращаем значения по умолчанию
    if (process.env.NODE_ENV === 'test') {
      if (key === 'VITE_API_URL') return 'http://localhost:5000';
      // Добавьте другие переменные окружения при необходимости
    }
    
    return defaultValue;
  };
  
  // Для TypeScript
  declare global {
    interface Window {
      import?: {
        meta: {
          env: Record<string, string>;
        };
      };
    }
  }