// src/services/encryption/__tests__/EncryptionService.test.ts
import { EncryptionService } from '../EncryptionService';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    encryptionService = EncryptionService.getInstance();
    await encryptionService.initializeEncryption();
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a message correctly', () => {
      const originalMessage = 'Hello, this is a secret message!';
      
      const encryptedMessage = encryptionService.encrypt(originalMessage);
      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(originalMessage);
      
      const decryptedMessage = encryptionService.decrypt(encryptedMessage);
      expect(decryptedMessage).toBe(originalMessage);
    });

    it('should produce different encrypted output for same input', () => {
      const message = 'Test message';
      
      const encrypted1 = encryptionService.encrypt(message);
      const encrypted2 = encryptionService.encrypt(message);
      
      expect(encrypted1).not.toBe(encrypted2);
      expect(encryptionService.decrypt(encrypted1)).toBe(message);
      expect(encryptionService.decrypt(encrypted2)).toBe(message);
    });

    it('should handle empty strings', () => {
      const emptyMessage = '';
      const encrypted = encryptionService.encrypt(emptyMessage);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(emptyMessage);
    });

    it('should handle unicode characters', () => {
      const unicodeMessage = '🔒 Secure message with émojis and åccénts! 中文';
      const encrypted = encryptionService.encrypt(unicodeMessage);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(unicodeMessage);
    });

    it('should handle long messages', () => {
      const longMessage = 'A'.repeat(10000);
      const encrypted = encryptionService.encrypt(longMessage);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(longMessage);
    });

    it('should throw error when decrypting invalid data', () => {
      expect(() => {
        encryptionService.decrypt('invalid-encrypted-data');
      }).toThrow();
    });
  });

  describe('generateKeyPair', () => {
    it('should generate valid key pairs', () => {
      const keyPair = encryptionService.generateKeyPair();
      
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).not.toBe(keyPair.publicKey);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
    });

    it('should generate different key pairs each time', () => {
      const keyPair1 = encryptionService.generateKeyPair();
      const keyPair2 = encryptionService.generateKeyPair();
      
      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey);
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
    });
  });

  describe('error handling', () => {
    it('should throw error when encryption not initialized', () => {
      const newService = new (EncryptionService as any)();
      
      expect(() => {
        newService.encrypt('test');
      }).toThrow('Encryption not initialized');
    });

    it('should throw error when decryption not initialized', () => {
      const newService = new (EncryptionService as any)();
      
      expect(() => {
        newService.decrypt('test');
      }).toThrow('Encryption not initialized');
    });
  });
});



