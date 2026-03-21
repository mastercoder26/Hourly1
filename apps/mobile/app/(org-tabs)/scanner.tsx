import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Card, TextValueLarge, TextRegular, TextCaption, PillButton } from '../../components/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_APPLICATIONS: Record<string, { name: string; grade: string; hours: number }> = {
  'app_5k9z2v1x': { name: 'Sarah Jenkins', grade: '10th', hours: 42.5 },
};

export default function ScannerTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<{ name: string; grade: string; hours: number } | null>(null);
  const [roster, setRoster] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = await AsyncStorage.getItem('@roster_queue');
      if (q) setRoster(JSON.parse(q));
    };
    load();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scannedData) return;
    setScannedData(data);
    const info = MOCK_APPLICATIONS[data];
    if (info) {
      setStudentInfo(info);
    } else {
      Alert.alert('Not Found', 'Invalid QR code.', [
        { text: 'OK', onPress: () => setScannedData(null) },
      ]);
    }
  };

  const handleConfirm = async () => {
    if (!studentInfo) return;
    const updated = [...roster, studentInfo.name];
    setRoster(updated);
    await AsyncStorage.setItem('@roster_queue', JSON.stringify(updated));
    Alert.alert('Checked In!', `${studentInfo.name} is now active.`, [
      { text: 'Next', onPress: () => { setScannedData(null); setStudentInfo(null); } },
    ]);
  };

  const handleNoShow = () => {
    if (!studentInfo) return;
    Alert.alert('Flagged', `${studentInfo.name} marked as no-show.`);
    setScannedData(null);
    setStudentInfo(null);
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6 bg-offWhite dark:bg-black">
        <TextValueLarge className="text-center mb-4">Camera Access</TextValueLarge>
        <TextRegular className="text-textMuted text-center mb-8">
          We need camera access to scan volunteer QR codes.
        </TextRegular>
        <PillButton
          label="Grant Permission"
          onPress={requestPermission}
          style={{ backgroundColor: '#534AB7' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <SafeAreaView className="flex-1 justify-between">
          {/* Top label */}
          <View className="mt-6 items-center">
            <View className="bg-black/60 px-6 py-3 rounded-pill">
              <TextRegular className="text-white">Scan Volunteer QR Code</TextRegular>
            </View>
          </View>

          {/* Scan frame */}
          <View className="items-center justify-center">
            <View
              style={{
                width: 240,
                height: 240,
                borderWidth: 2,
                borderColor: '#534AB7',
                borderRadius: 24,
              }}
            />
          </View>

          {/* Bottom panel */}
          <View className="p-6 pb-10">
            {studentInfo ? (
              <Card className="p-6">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-full bg-[#534AB720] items-center justify-center mr-3">
                    <TextRegular className="text-purple font-bold">
                      {studentInfo.name.charAt(0)}
                    </TextRegular>
                  </View>
                  <View>
                    <TextRegular className="font-semibold">{studentInfo.name}</TextRegular>
                    <TextCaption>{studentInfo.grade} Grade • {studentInfo.hours} Hrs total</TextCaption>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <PillButton
                    label="Check In"
                    onPress={handleConfirm}
                    variant="primary"
                    className="flex-1"
                  />
                  <PillButton
                    label="No Show"
                    onPress={handleNoShow}
                    variant="ghost"
                    className="flex-1"
                  />
                </View>
              </Card>
            ) : (
              <Card className="p-5">
                <TextCaption className="font-semibold mb-3">
                  Live Roster ({roster.length} Checked In)
                </TextCaption>
                {roster.slice(-3).reverse().map((name, i) => (
                  <TextCaption key={i} className="mb-1 text-teal">✓ {name}</TextCaption>
                ))}
                {roster.length === 0 && (
                  <TextCaption className="text-textMuted">Waiting for first scan…</TextCaption>
                )}
              </Card>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
