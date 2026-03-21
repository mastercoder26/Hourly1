// Messages screen — in-app messaging
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { MessageThread } from '../../components/MessageThread';
import { mockMessages } from '../../mocks/data';

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>
      <MessageThread
        messages={mockMessages}
        currentUserId="stu-001"
        onSend={(text) => { /* Mock: would POST to API */ }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.dark.element },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: Colors.dark.textPrimary },
  title: { fontSize: 17, fontWeight: '500', color: Colors.dark.textPrimary },
});
