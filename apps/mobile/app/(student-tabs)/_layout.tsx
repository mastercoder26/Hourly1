// Student Tabs Layout — bottom tab navigator
import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';;
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

export default function StudentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.teal,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon name="Explore" focused={focused} emoji="🔍" />,
        }}
      />
      <Tabs.Screen
        name="my-shifts"
        options={{
          title: 'My shifts',
          tabBarIcon: ({ focused }) => <TabIcon name="Shifts" focused={focused} emoji="📋" />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => <TabIcon name="Portfolio" focused={focused} emoji="📊" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} emoji="👤" />,
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
    color: Colors.teal,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.teal,
    marginTop: 2,
  },
});
