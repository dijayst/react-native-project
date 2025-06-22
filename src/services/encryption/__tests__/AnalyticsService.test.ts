
// src/services/analytics/__tests__/AnalyticsService.test.ts

import { FeatureFlagService } from '../../../utils/featureFlags';
import { AnalyticsService } from '../../analytics/AnalyticsService';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = AnalyticsService.getInstance();
    analyticsService.clearEvents();
    FeatureFlagService.setFlag('analytics', true);
  });

  describe('track', () => {
    it('should track events when analytics is enabled', () => {
      analyticsService.track('test_event', { key: 'value' });
      
      const events = analyticsService.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('test_event');
      expect(events[0].properties).toEqual({ key: 'value' });
      expect(events[0].timestamp).toBeGreaterThan(0);
    });

    it('should not track events when analytics is disabled', () => {
      FeatureFlagService.setFlag('analytics', false);
      
      analyticsService.track('test_event', { key: 'value' });
      
      const events = analyticsService.getEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('user action tracking', () => {
    it('should track message sent events', () => {
      analyticsService.trackMessageSent(50, true);
      
      const events = analyticsService.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('message_sent');
      expect(events[0].properties).toEqual({
        message_length: 50,
        is_encrypted: true,
        user_action: 'send_message'
      });
    });

    it('should track message read events', () => {
      analyticsService.trackMessageRead('msg123');
      
      const events = analyticsService.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('message_read');
      expect(events[0].properties).toEqual({
        message_id: 'msg123',
        user_action: 'read_message'
      });
    });

    it('should track chat opened events', () => {
      analyticsService.trackChatOpened(25);
      
      const events = analyticsService.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('chat_opened');
      expect(events[0].properties).toEqual({
        message_count: 25,
        user_action: 'open_chat'
      });
    });
  });

  describe('clearEvents', () => {
    it('should clear all tracked events', () => {
      analyticsService.track('event1');
      analyticsService.track('event2');
      
      expect(analyticsService.getEvents()).toHaveLength(2);
      
      analyticsService.clearEvents();
      
      expect(analyticsService.getEvents()).toHaveLength(0);
    });
  });
});