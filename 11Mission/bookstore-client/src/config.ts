// src/config.ts
export const API_BASE_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://YOUR-AZURE-API-NAME.azurewebsites.net'
        : 'http://localhost:5225';