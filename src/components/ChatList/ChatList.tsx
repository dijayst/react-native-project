
// src/components/ChatList/ChatList.tsx
import React, { useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useChatStore } from '../../store/chatStore';
import { Message } from '../../types';
import { PerformanceUtils } from '../../utils/performance';
import { FeatureFlagService } from '../../utils/featureFlags';
import ChatItem from './ChatItem';
import MessageInput from './MessageInput';

const CURRENT_USER_ID = 'current_user'; // In real app, get from auth

const ChatList: React.FC = () => {
  const {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
  } = useChatStore();

  const optimizedProps = useMemo(() => 
    FeatureFlagService.getFlag('virtualizedList') 
      ? PerformanceUtils.getOptimizedFlatListProps()
      : {},
    []
  );

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <ChatItem
      message={item}
      isOwnMessage={item.senderId === CURRENT_USER_ID}
    />
  ), []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content, CURRENT_USER_ID);
  }, [sendMessage]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing secure chat...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Secure Chat</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isConnected ? '#34C759' : '#FF3B30' }
        ]} />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={styles.messagesList}
        inverted
        {...optimizedProps}
        getItemLayout={FeatureFlagService.getFlag('virtualizedList') ? getItemLayout : undefined}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:"green",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messagesList: {
    flex: 1,
  },
});

export default ChatList;