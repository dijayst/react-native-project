// src/config/security.ts


export const SecurityConfig = {
  // Never commit these to version control!
  // Load from environment variables or secure key management
  ABLY_API_KEY: process.env.ABLY_API_KEY || '',
  ENCRYPTION_SALT: process.env.ENCRYPTION_SALT || '',
  
  // Security headers for API calls
  getSecureHeaders: () => ({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }),
  
  // Validate API keys format
  validateApiKey: (key: string): boolean => {
    return key.length > 20 && key.includes('.') && key.includes(':');
  }
};






/*

import { ABLY_API_KEY, ENCRYPTION_SALT } from '@env';

export const SecurityConfig = {
  ABLY_API_KEY,
  ENCRYPTION_SALT,

  getSecureHeaders: () => ({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }),

  validateApiKey: (key: string): boolean => {
    return key.length > 20 && key.includes('.') && key.includes(':');
  }
};
*/