// src/services/messaging/AblyService.ts
import Ably from 'ably';
import { Message } from '../../types';
import { EncryptionService } from '../encryption/EncryptionService';
import { FeatureFlagService } from '../../utils/featureFlags';

export class AblyService {
  private static instance: AblyService;
  private client: Ably.Realtime | null = null;
  private channel: Ably.Types.RealtimeChannelPromise | null = null;
  private encryptionService: EncryptionService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
  }

  static getInstance(): AblyService {
    if (!AblyService.instance) {
      AblyService.instance = new AblyService();
    }
    return AblyService.instance;
  }

  async initialize(apiKey: string, channelName: string): Promise<void> {
    try {
      this.client = new Ably.Realtime({
        key: apiKey,
        clientId: `user_${Date.now()}`,
      });

      this.channel = this.client.channels.get(channelName);
      
      if (FeatureFlagService.getFlag('encryption')) {
        await this.encryptionService.initializeEncryption();
      }
    } catch (error) {
      console.error('Failed to initialize Ably:', error);
      throw error;
    }
  }

  async sendMessage(content: string, senderId: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    let messageContent = content;
    let isEncrypted = false;

    if (FeatureFlagService.getFlag('encryption')) {
      messageContent = this.encryptionService.encrypt(content);
      isEncrypted = true;
    }

    const message: Omit<Message, 'id'> = {
      content: isEncrypted ? '' : content,
      encryptedContent: isEncrypted ? messageContent : undefined,
      senderId,
      timestamp: Date.now(),
      isEncrypted,
      status: 'sending'
    };

    await this.channel.publish('message', message);
  }

  subscribeToMessages(callback: (message: Message) => void): void {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    this.channel.subscribe('message', (message) => {
      try {
        const messageData = message.data as Omit<Message, 'id'>;
        let content = messageData.content;

        if (messageData.isEncrypted && messageData.encryptedContent) {
          content = this.encryptionService.decrypt(messageData.encryptedContent);
        }

        const fullMessage: Message = {
          ...messageData,
          id: message.id || `msg_${Date.now()}_${Math.random()}`,
          content,
          status: 'delivered'
        };

        callback(fullMessage);
      } catch (error) {
        console.error('Error processing received message:', error);
      }
    });
  }

  getConnectionStatus(): string {
    return this.client?.connection.state || 'disconnected';
  }

  disconnect(): void {
    this.client?.close();
    this.client = null;
    this.channel = null;
  }
}