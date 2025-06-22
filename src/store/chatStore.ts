// src/store/chatStore.ts
import { create } from 'zustand';
import { Message, ChatState } from '../types';
import { StorageService } from '../services/storage/StorageService';
import { AblyService } from '../services/messaging/AblyService';
import { AnalyticsService } from '../services/analytics/AnalyticsService';
import { FeatureFlagService } from '../utils/featureFlags';

interface ChatStore extends ChatState {
  // Actions
  initializeChat: (apiKey: string, channelName: string) => Promise<void>;
  sendMessage: (content: string, senderId: string) => Promise<void>;
  loadOfflineMessages: () => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setConnectionStatus: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  messages: [],
  isConnected: false,
  isLoading: false,
  error: null,

  // Actions
  initializeChat: async (apiKey: string, channelName: string) => {
    try {
      set({ isLoading: true, error: null });

      const ablyService = AblyService.getInstance();
      const analyticsService = AnalyticsService.getInstance();

      await ablyService.initialize(apiKey, channelName);

      // Load offline messages first
      if (FeatureFlagService.getFlag('offlineMode')) {
        const offlineMessages = await StorageService.loadMessages();
        set({ messages: offlineMessages });
      }

      // Subscribe to new messages
      ablyService.subscribeToMessages((message: Message) => {
        const { messages } = get();
        const updatedMessages = [...messages, message];
        set({ messages: updatedMessages });

        // Save to offline storage
        if (FeatureFlagService.getFlag('offlineMode')) {
          StorageService.saveMessages(updatedMessages);
        }

        // Track analytics
        analyticsService.trackMessageRead(message.id);
      });

      set({ isConnected: true, isLoading: false });
      
      // Track chat opened
      analyticsService.trackChatOpened(get().messages.length);

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize chat',
        isLoading: false,
        isConnected: false
      });
    }
  },

  sendMessage: async (content: string, senderId: string) => {
    try {
      const ablyService = AblyService.getInstance();
      const analyticsService = AnalyticsService.getInstance();

      // Create optimistic message
      const optimisticMessage: Message = {
        id: `temp_${Date.now()}`,
        content,
        senderId,
        timestamp: Date.now(),
        isEncrypted: FeatureFlagService.getFlag('encryption'),
        status: 'sending'
      };

      // Add to local state immediately
      const { messages } = get();
      const updatedMessages = [...messages, optimisticMessage];
      set({ messages: updatedMessages });

      // Send through Ably
      await ablyService.sendMessage(content, senderId);

      // Track analytics
      analyticsService.trackMessageSent(
        content.length,
        FeatureFlagService.getFlag('encryption')
      );

      // Update message status
      const finalMessages = updatedMessages.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      );
      set({ messages: finalMessages });

      // Save to offline storage
      if (FeatureFlagService.getFlag('offlineMode')) {
        await StorageService.saveMessages(finalMessages);
      }

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
    }
  },

  loadOfflineMessages: async () => {
    if (!FeatureFlagService.getFlag('offlineMode')) return;

    try {
      const messages = await StorageService.loadMessages();
      set({ messages });
    } catch (error) {
      console.error('Failed to load offline messages:', error);
    }
  },

  addMessage: (message: Message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },

  clearMessages: () => {
    set({ messages: [] });
    if (FeatureFlagService.getFlag('offlineMode')) {
      StorageService.saveMessages([]);
    }
  },

  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  }
}));
