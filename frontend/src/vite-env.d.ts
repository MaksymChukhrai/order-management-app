/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL: string;
      readonly [key: string]: string;
    }
  }
  
  // Добавляем для Jest
  declare namespace NodeJS {
    interface Global {
      import?: {
        meta: {
          env: {
            VITE_API_URL: string;
            [key: string]: string;
          }
        }
      }
    }
  }