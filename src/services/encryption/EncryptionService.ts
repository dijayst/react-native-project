// src/services/encryption/EncryptionService.ts
import CryptoJS from 'crypto-js';
import { generateSecureRandom } from 'react-native-securerandom';
import { EncryptionKeys } from '../../types';


export class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: string | null = null;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async initializeEncryption(): Promise<void> {
    if (!this.encryptionKey) {
      const randomBytes = await generateSecureRandom(32);
      this.encryptionKey = CryptoJS.lib.WordArray.create(randomBytes).toString();
    }
  }

  encrypt(message: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption not initialized');
    }

    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(message, this.encryptionKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  }

  decrypt(encryptedMessage: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption not initialized');
    }

    const ciphertext = CryptoJS.enc.Base64.parse(encryptedMessage);
    const iv = CryptoJS.lib.WordArray.create(ciphertext.words.slice(0, 4));
    const encrypted = CryptoJS.lib.WordArray.create(ciphertext.words.slice(4));

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted } as any,
      this.encryptionKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generateKeyPair(): EncryptionKeys {
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    const publicKey = CryptoJS.SHA256(privateKey).toString();
    
    return {
      privateKey,
      publicKey
    };
  }
}