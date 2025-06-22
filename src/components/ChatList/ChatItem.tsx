// src/components/ChatList/ChatItem.tsx
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../types';

interface ChatItemProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatItem: React.FC<ChatItemProps> = memo(({ message, isOwnMessage }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownText : styles.otherText
        ]}>
          {message.content}
        </Text>
        <View style={styles.messageInfo}>
          <Text style={styles.timeText}>
            {formatTime(message.timestamp)}
          </Text>
          {message.isEncrypted && (
            <Text style={styles.encryptedIcon}>🔒</Text>
          )}
          {isOwnMessage && (
            <Text style={styles.statusIcon}>
              {message.status === 'sent' ? '✓' : 
               message.status === 'delivered' ? '✓✓' : 
               message.status === 'read' ? '✓✓' : '⏳'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: 'white',
  },
  otherText: {
    color: 'black',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginRight: 4,
  },
  encryptedIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
});

export default ChatItem;































