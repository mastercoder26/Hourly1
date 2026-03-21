// Org Tabs Layout — bottom tab navigator (purple accent)
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

function TabIcon({ name, focused, emoji }: { name: string; focused: boolean; emoji: string }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function OrgTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.purple,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="Dashboard" focused={focused} emoji="📊" />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ focused }) => <TabIcon name="Events" focused={focused} emoji="📋" />,
        }}
      />
      <Tabs.Screen
        name="applicants"
        options={{
          title: 'People',
          tabBarIcon: ({ focused }) => <TabIcon name="People" focused={focused} emoji="👥" />,
        }}
      />
      <Tabs.Screen
        name="org-profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} emoji="🏢" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.dark.card,
    borderTopWidth: 0,
    height: 85,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabEmojiActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.dark.textTertiary,
  },
  tabLabelActive: {
    color: Colors.purple,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.purple,
    marginTop: 2,
  },
});
