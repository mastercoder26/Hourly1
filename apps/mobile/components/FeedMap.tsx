import React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { Opportunity } from '../types';
import { useRouter } from 'expo-router';

interface FeedMapProps {
  opportunities: Opportunity[];
}

export function FeedMap({ opportunities }: FeedMapProps) {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Feather name="map" size={48} color={Colors.dark.textSecondary} />
        <Text style={styles.webFallbackText}>Interactive map coming soon to web</Text>
      </View>
    );
  }

  try {
    const MapView = require('react-native-maps').default;
    const { Marker, Callout } = require('react-native-maps');

    // Calculate a rough bounding box or use a central starting point (Austin, TX)
    const initialRegion = {
      latitude: 30.2672,
      longitude: -97.7431,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    return (
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider="google"
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
      >
        {opportunities.map((opp) => (
          <Marker
            key={opp.id}
            coordinate={{
              latitude: opp.location.lat,
              longitude: opp.location.lng,
            }}
            pinColor={Colors.teal}
          >
            <Callout tooltip onPress={() => router.push(`/opportunity/${opp.id}`)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{opp.title}</Text>
                <Text style={styles.calloutSubtitle}>{opp.orgName}</Text>
                <Text style={styles.calloutTap}>Tap to view details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    );
  } catch (err) {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webFallbackText}>Map failed to load.</Text>
      </View>
    );
  }
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
  },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.element,
    gap: 16,
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  calloutContainer: {
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: Colors.dark.element,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  calloutTap: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
  },
});