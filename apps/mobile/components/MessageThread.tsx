// MessageThread — in-app messaging UI
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/Themed';;
import { Colors } from '../constants/colors';
import { Message } from '../types';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSend?: (text: string) => void;
}

export function MessageThread({ messages, currentUserId, onSend }: MessageThreadProps) {
  const [inputText, setInputText] = useState('');
  const [threadMessages, setThreadMessages] = useState<Message[]>(messages);

  useEffect(() => {
    setThreadMessages(messages);
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const currentUserRole =
      threadMessages.find(message => message.senderId === currentUserId)?.senderRole ?? 'student';
    const applicationId =
      threadMessages[0]?.applicationId ?? messages[0]?.applicationId ?? 'local-thread';

    const localMessage: Message = {
      id: `local-${Date.now()}`,
      applicationId,
      senderId: currentUserId,
      senderName: 'You',
      senderRole: currentUserRole,
      text,
      sentAt: new Date().toISOString(),
    };

    setThreadMessages(prev => [...prev, localMessage]);
    onSend?.(text);
    setInputText('');
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === currentUserId;
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {!isOwn && <Text style={styles.senderName}>{item.senderName}</Text>}
        <Text style={[styles.messageText, isOwn ? styles.messageTextOwn : styles.messageTextOther]}>
          {item.text}
        </Text>
        <Text style={styles.timeText}>{formatTime(item.sentAt)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={threadMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.dark.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 4,
  },
  bubbleOwn: {
    backgroundColor: Colors.teal,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: Colors.dark.element,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: Colors.dark.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 24,
    gap: 10,
    backgroundColor: Colors.dark.card,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.element,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.element,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.dark.textPrimary,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.dark.element,
  },
  sendText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
