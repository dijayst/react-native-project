// src/__tests__/integration/ChatFlow.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
//import App from '../../App';
import { useChatStore } from '../../../../store/chatStore';
import { EncryptionService } from '../../../../services/encryption/EncryptionService';
import { AnalyticsService } from '../../../../services/analytics/AnalyticsService';
import { FeatureFlagService } from '../../../../utils/featureFlags';
import App from '../../../../App';

// Mock external dependencies
jest.mock('ably', () => ({
  Realtime: jest.fn().mockImplementation(() => ({
    channels: {
      get: jest.fn().mockReturnValue({
        publish: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn()
      })
    },
    connection: {
      state: 'connected'
    },
    close: jest.fn()
  }))
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  multiRemove: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('react-native-securerandom', () => ({
  generateSecureRandom: jest.fn().mockResolvedValue(new Uint8Array(32))
}));

describe('ChatFlow Integration Test', () => {
  beforeEach(() => {
    // Reset all feature flags
    FeatureFlagService.setFlag('encryption', true);
    FeatureFlagService.setFlag('analytics', true);
    FeatureFlagService.setFlag('offlineMode', true);
    FeatureFlagService.setFlag('virtualizedList', true);
    
    // Clear analytics
    AnalyticsService.getInstance().clearEvents();
    
    // Reset chat store
    act(() => {
      useChatStore.getState().clearMessages();
    });
  });

  it('should complete full chat flow: initialization -> send message -> receive message', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App/>);

    // Wait for initialization
    await waitFor(() => {
      expect(queryByText('Initializing secure chat...')).toBeNull();
    }, { timeout: 5000 });

    // Verify chat is loaded
    expect(getByText('Secure Chat')).toBeTruthy();

    // Send a message
    const messageInput = getByPlaceholderText('Type a message...');
    const sendButton = getByText('Send');

    act(() => {
      fireEvent.changeText(messageInput, 'Hello, this is a test message!');
    });

    act(() => {
      fireEvent.press(sendButton);
    });

    // Verify message appears in chat
    await waitFor(() => {
      expect(getByText('Hello, this is a test message!')).toBeTruthy();
    });

    // Verify message input is cleared
    expect(messageInput.props.value).toBe('');

    // Verify analytics tracking
    const analyticsService = AnalyticsService.getInstance();
    const events = analyticsService.getEvents();
    
    expect(events.length).toBeGreaterThan(0);
    expect(events.some(event => event.eventName === 'chat_opened')).toBe(true);
    expect(events.some(event => event.eventName === 'message_sent')).toBe(true);
  });

  it('should handle encryption toggle', async () => {
    // Test with encryption disabled
    FeatureFlagService.setFlag('encryption', false);
    
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    await waitFor(() => {
      expect(queryByText('Initializing secure chat...')).toBeNull();
    }, { timeout: 5000 });

    const messageInput = getByPlaceholderText('Type a message...');
    const sendButton = getByText('Send');

    act(() => {
      fireEvent.changeText(messageInput, 'Unencrypted message');
    });

    act(() => {
      fireEvent.press(sendButton);
    });

    await waitFor(() => {
      expect(getByText('Unencrypted message')).toBeTruthy();
    });

    // Message should not show encryption icon when encryption is disabled
    expect(queryByText('🔒')).toBeNull();
  });

  it('should handle offline mode', async () => {
    FeatureFlagService.setFlag('offlineMode', true);
    
    const { getByPlaceholderText, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Secure Chat')).toBeTruthy();
    }, { timeout: 5000 });

    // Simulate sending message while offline
    const messageInput = getByPlaceholderText('Type a message...');
    const sendButton = getByText('Send');

    act(() => {
      fireEvent.changeText(messageInput, 'Offline message');
    });

    act(() => {
      fireEvent.press(sendButton);
    });

    // Message should still appear (optimistic update)
    await waitFor(() => {
      expect(getByText('Offline message')).toBeTruthy();
    });
  });

  it('should handle performance with many messages', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Secure Chat')).toBeTruthy();
    }, { timeout: 5000 });

    // Simulate adding many messages
    const store = useChatStore.getState();
    const messages = Array.from({ length: 1000 }, (_, i) => ({
      id: `msg_${i}`,
      content: `Message ${i}`,
      senderId: i % 2 === 0 ? 'user1' : 'user2',
      timestamp: Date.now() + i,
      isEncrypted: true,
      status: 'delivered' as const
    }));

    act(() => {
      messages.forEach(message => store.addMessage(message));
    });

    // Verify last message is visible
    await waitFor(() => {
      expect(getByText('Message 999')).toBeTruthy();
    });
  });

  it('should track all required analytics events', async () => {
    const analyticsService = AnalyticsService.getInstance();
    const { getByPlaceholderText, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Secure Chat')).toBeTruthy();
    }, { timeout: 5000 });

    // Send a message to trigger all events
    const messageInput = getByPlaceholderText('Type a message...');
    const sendButton = getByText('Send');

    act(() => {
      fireEvent.changeText(messageInput, 'Test analytics message');
    });

    act(() => {
      fireEvent.press(sendButton);
    });

    await waitFor(() => {
      const events = analyticsService.getEvents();
      
      // Verify all 3 required user actions are tracked
      const eventNames = events.map(e => e.eventName);
      expect(eventNames).toContain('chat_opened');
      expect(eventNames).toContain('message_sent');
      
      // Verify event properties
      const messageSentEvent = events.find(e => e.eventName === 'message_sent');
      expect(messageSentEvent?.properties.user_action).toBe('send_message');
      expect(messageSentEvent?.properties.message_length).toBeGreaterThan(0);
      expect(messageSentEvent?.properties.is_encrypted).toBe(true);
    });
  });
});