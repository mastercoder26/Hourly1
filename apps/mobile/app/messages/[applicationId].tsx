// Messages screen - in-app messaging
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { MessageThread } from '../../components/MessageThread';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useDemoAuth } from '../../context/DemoAuthContext';
import { DEMO_STUDENT_ID } from '@hourly/shared';
import { isDemoMode } from '../../lib/dataMode';

export default function MessagesScreen() {
  const router = useRouter();
  const { applicationId } = useLocalSearchParams<{ applicationId: string }>();
  const id = Array.isArray(applicationId) ? applicationId[0] : applicationId ?? 'app-001';
  const { demoRole } = useDemoAuth();

  const allMessages = useDemoStore(s => s.messages);
  const appendMessage = useDemoStore(s => s.appendMessage);
  const application = useDemoStore(s => s.applications.find(a => a.id === id));

  const threadMessages = useMemo(
    () => allMessages.filter(m => m.applicationId === id),
    [allMessages, id],
  );

  const senderRole = demoRole === 'organizer' ? 'organizer' : 'student';
  const currentUserId =
    senderRole === 'student' ? (application?.studentId ?? DEMO_STUDENT_ID) : 'org-coord';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader variant="close" title="Messages" onPress={() => router.back()} />
      </View>
      <MessageThread
        messages={threadMessages}
        currentUserId={currentUserId}
        onSend={text => {
          if (isDemoMode()) {
            appendMessage(id, text, senderRole);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  header: {
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.element,
  },
});
