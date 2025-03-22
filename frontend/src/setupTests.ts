// frontend/src/setupTests.ts
import '@testing-library/jest-dom';

// Расширяем ожидания Jest с матчерами Testing Library
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
 
    }
  }
}

// Мокируем import.meta.env
Object.defineProperty(window, 'import', {
  value: {
    meta: {
      env: { 
        VITE_API_URL: 'http://localhost:5000'
      }
    }
  }
});