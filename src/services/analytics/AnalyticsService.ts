
// src/services/analytics/AnalyticsService.ts
import { FeatureFlagService } from '../../utils/featureFlags';

export interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, any>;
  timestamp: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  track(eventName: string, properties: Record<string, any> = {}): void {
    if (!FeatureFlagService.getFlag('analytics')) {
      return;
    }

    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: Date.now()
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // In production, send to analytics service
    this.sendToAnalyticsService(event);
  }

  // Track the 3 required user actions
  trackMessageSent(messageLength: number, isEncrypted: boolean): void {
    this.track('message_sent', {
      message_length: messageLength,
      is_encrypted: isEncrypted,
      user_action: 'send_message'
    });
  }

  trackMessageRead(messageId: string): void {
    this.track('message_read', {
      message_id: messageId,
      user_action: 'read_message'
    });
  }

  trackChatOpened(messageCount: number): void {
    this.track('chat_opened', {
      message_count: messageCount,
      user_action: 'open_chat'
    });
  }

  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    // Implement actual analytics service integration here
    // For now, just log locally
    try {
      // await fetch('your-analytics-endpoint', {
      //   method: 'POST',
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}