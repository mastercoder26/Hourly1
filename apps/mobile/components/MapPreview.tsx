// MapPreview — Google Maps integration for opportunity detail view
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from '@/components/Themed';;
import { Colors, CardStyle } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  userLatitude?: number;
  userLongitude?: number;
  height?: number;
}

// For web, we use a static map image
// For native, we use react-native-maps (conditionally imported)
function NativeMap({ latitude, longitude, title, userLatitude, userLongitude, height }: MapPreviewProps) {
  try {
    const MapView = require('react-native-maps').default;
    const { Marker } = require('react-native-maps');
    
    return (
      <MapView
        style={[styles.map, { height }]}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        provider="google"
        customMapStyle={darkMapStyle}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          pinColor={Colors.teal}
        />
        {userLatitude && userLongitude && (
          <Marker
            coordinate={{ latitude: userLatitude, longitude: userLongitude }}
            title="Your location"
            pinColor="#007AFF"
          />
        )}
      </MapView>
    );
  } catch {
    return <MapFallback latitude={latitude} longitude={longitude} address={title} height={height} />;
  }
}

function MapFallback({ latitude, longitude, address, height }: { latitude: number; longitude: number; address?: string; height?: number }) {
  return (
    <View style={[styles.fallback, { height }]}>
      <Feather name="map-pin" size={32} color={Colors.dark.textSecondary} />
      <Text style={styles.fallbackTitle}>{address || 'View on map'}</Text>
      <Text style={styles.fallbackCoords}>
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </Text>
    </View>
  );
}

export function MapPreview({
  latitude,
  longitude,
  title,
  address,
  userLatitude = 30.2672,
  userLongitude = -97.7431,
  height = 200,
}: MapPreviewProps) {
  if (Platform.OS === 'web') {
    return <MapFallback latitude={latitude} longitude={longitude} address={address || title} height={height} />;
  }

  return (
    <View style={styles.container}>
      <NativeMap
        latitude={latitude}
        longitude={longitude}
        title={title}
        userLatitude={userLatitude}
        userLongitude={userLongitude}
        height={height}
      />
      {address && (
        <View style={styles.addressContainer}>
          <Feather name="map-pin" size={14} color={Colors.dark.textSecondary} />
          <Text style={styles.addressText}>{address}</Text>
        </View>
      )}
    </View>
  );
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
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.dark.element,
  },
  map: {
    width: '100%',
    borderRadius: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.dark.card,
  },
  addressText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  fallback: {
    backgroundColor: Colors.dark.element,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  fallbackCoords: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
});
