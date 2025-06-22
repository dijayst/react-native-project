// src/types/index.ts
export interface Message {
  id: string;
  content: string;
  encryptedContent?: string;
  senderId: string;
  timestamp: number;
  isEncrypted: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface EncryptionKeys {
  publicKey: string;
  privateKey: string;
}

export interface FeatureFlags {
  encryption: boolean;
  analytics: boolean;
  offlineMode: boolean;
  virtualizedList: boolean;
}

 // types/env.d.ts
declare module '@env' {
  export const ABLY_API_KEY: string;
  export const ENCRYPTION_SALT: string;
}
