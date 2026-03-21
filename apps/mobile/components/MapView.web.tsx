import React from 'react';
import { View, Text } from 'react-native';

export function Marker(props: any) {
  return null;
}

export default function MapView({ style, children }: any) {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e5e5', minHeight: 200 }, style]}>
      <Text style={{ color: '#666' }}>Interactive Map not supported on web</Text>
      {/* We don't render children (Markers) on the web to avoid errors */}
    </View>
  );
}