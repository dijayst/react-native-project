// src/services/storage/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EncryptionKeys, Message } from '../../types';

export class StorageService {
  private static readonly MESSAGES_KEY = 'encrypted_messages';
  private static readonly KEYS_KEY = 'encryption_keys';

  static async saveMessages(messages: Message[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem(this.MESSAGES_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }

  static async loadMessages(): Promise<Message[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.MESSAGES_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  static async saveEncryptionKeys(keys: EncryptionKeys): Promise<void> {
    try {
      const jsonValue = JSON.stringify(keys);
      await AsyncStorage.setItem(this.KEYS_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving keys:', error);
    }
  }

  static async loadEncryptionKeys(): Promise<EncryptionKeys | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.KEYS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading keys:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.MESSAGES_KEY, this.KEYS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}