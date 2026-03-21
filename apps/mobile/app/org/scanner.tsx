import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Surface, Typography, PillButton } from '../../components/ui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocks
const MOCK_APPLICATIONS = {
  'app_5k9z2v1x': {
    name: 'Sarah Jenkins',
    grade: '10th',
    hours: 42.5,
  }
};

export default function AppScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  
  // Roster queue
  const [roster, setRoster] = useState<string[]>([]);

  useEffect(() => {
    // Load cached roster
    const loadQueue = async () => {
      const q = await AsyncStorage.getItem('@roster_queue');
      if (q) setRoster(JSON.parse(q));
    };
    loadQueue();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scannedData) return;
    setScannedData(data);
    
    // Fetch mock application
    const info = MOCK_APPLICATIONS[data as keyof typeof MOCK_APPLICATIONS];
    if (info) {
      setStudentInfo(info);
    } else {
      Alert.alert('Not Found', 'Invalid QR code or application not found. Try again.', [
        { text: 'OK', onPress: () => setScannedData(null) }
      ]);
    }
  };

  const handleConfirm = async () => {
    // Mock PATCH /attendance/:id
    const updated = [...roster, studentInfo.name];
    setRoster(updated);
    await AsyncStorage.setItem('@roster_queue', JSON.stringify(updated));
    
    Alert.alert('Checked In!', `${studentInfo.name} is now active.`, [
      { 
        text: 'Next', 
        onPress: () => {
          setScannedData(null);
          setStudentInfo(null);
        }
      }
    ]);
  };

  const handleNoShow = () => {
    Alert.alert('Flagged No Show', `${studentInfo.name} marked as absent.`);
    setScannedData(null);
    setStudentInfo(null);
  };

  if (!permission) {
    return <View className="flex-1 bg-zinc-950" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-zinc-950">
        <Typography variant="body" className="text-center mb-6">We need your permission to show the camera</Typography>
        <PillButton title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View className="flex-1 justify-between p-6">
          <View className="mt-12 items-center">
            <Typography variant="h3" className="text-white bg-black/50 px-4 py-2 rounded-full">Scan Volunteer QR</Typography>
          </View>
          
          <View className="mb-12 border-2 border-primary-500 rounded-3xl h-64 w-64 self-center mx-auto absolute top-1/2 -mt-32 -ml-32" style={{ left: '50%' }} />

          {studentInfo && (
            <Surface className="p-6 bg-white dark:bg-zinc-900 rounded-3xl">
              <Typography variant="h3">{studentInfo.name}</Typography>
              <Typography variant="body" className="text-zinc-500">{studentInfo.grade} Grade • {studentInfo.hours} Total Hrs</Typography>
              
              <View className="flex-row mt-6 space-x-4 gap-4">
                <PillButton 
                  title="Check In" 
                  onPress={handleConfirm} 
                  variant="primary" 
                  className="flex-1"
                />
                <PillButton 
                  title="No Show" 
                  onPress={handleNoShow} 
                  variant="secondary" 
                  className="flex-1"
                />
              </View>
            </Surface>
          )}

          {!studentInfo && (
            <Surface className="p-4 bg-white dark:bg-zinc-900 rounded-3xl">
              <Typography variant="caption" className="font-semibold mb-2">Live Roster ({roster.length} Checked In)</Typography>
              {roster.slice().reverse().map((r, i) => (
                <Typography key={i} variant="caption" className="text-zinc-500 mb-1">{r} - Present</Typography>
              ))}
              {roster.length === 0 && <Typography variant="caption" className="text-zinc-400">Waiting for first scan...</Typography>}
            </Surface>
          )}

        </View>
      </CameraView>
    </View>
  );
}
