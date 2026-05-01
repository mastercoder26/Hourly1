// Create Role — multi-step form wired to `org.createOpportunity` (live) or demo-only navigation.
import React, { useCallback, useMemo, useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { CauseTag } from '../../types';
import { enterRise } from '../../lib/motion';
import { trpc } from '../../lib/trpc';
import { isLiveMode } from '../../lib/dataMode';

const CAUSES: CauseTag[] = ['Environment', 'Education', 'Food', 'Animals', 'Seniors', 'Youth', 'Health', 'Arts'];

function combineLocalDateTime(dateYmd: string, timeHm: string): Date {
  const [y, m, d] = dateYmd.split('-').map(Number);
  const [hh, mm] = timeHm.split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) {
    return new Date(NaN);
  }
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export default function CreateRoleScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [causes, setCauses] = useState<CauseTag[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isCreditEligible, setIsCreditEligible] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endTimeStr, setEndTimeStr] = useState('12:00');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [latStr, setLatStr] = useState('30.2672');
  const [lngStr, setLngStr] = useState('-97.7431');
  const [totalSpotsStr, setTotalSpotsStr] = useState('20');
  const [ageMinStr, setAgeMinStr] = useState('14');
  const [whatToBringLine, setWhatToBringLine] = useState('Water bottle, Sunscreen');
  const totalSteps = 5;

  const createMutation = trpc.org.createOpportunity.useMutation();

  const toggleCause = useCallback((c: CauseTag) => {
    setCauses(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));
  }, []);

  const whatToBringList = useMemo(
    () =>
      whatToBringLine
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    [whatToBringLine],
  );

  const publish = useCallback(async () => {
    if (!isLiveMode()) {
      router.back();
      return;
    }

    const lat = Number.parseFloat(latStr);
    const lng = Number.parseFloat(lngStr);
    const totalSpots = Number.parseInt(totalSpotsStr, 10);
    const ageMinimum = ageMinStr.trim() === '' ? undefined : Number.parseInt(ageMinStr, 10);

    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a role title.');
      return;
    }
    if (causes.length === 0) {
      Alert.alert('Select causes', 'Pick at least one cause tag.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD (e.g. 2026-05-20).');
      return;
    }
    const start = combineLocalDateTime(dateStr.trim(), startTimeStr.trim());
    const end = combineLocalDateTime(dateStr.trim(), endTimeStr.trim());
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      Alert.alert('Invalid times', 'Check start/end times (HH:MM, 24h). End must be after start.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing address', 'Enter the event address.');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      Alert.alert('Invalid map coordinates', 'Enter valid latitude and longitude.');
      return;
    }
    if (!Number.isFinite(totalSpots) || totalSpots < 1) {
      Alert.alert('Invalid spots', 'Enter a positive number of volunteer spots.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: `${title.trim()} — posted from Hourly mobile.`,
        causeTags: causes,
        date: dateStr.trim(),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        address: address.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        lat,
        lng,
        totalSpots,
        ageMinimum: ageMinimum !== undefined && Number.isFinite(ageMinimum) ? ageMinimum : undefined,
        creditEligible: isCreditEligible,
        whatToBring: whatToBringList,
        recurring: isRecurring,
        publish: true,
      });
      Alert.alert('Published', 'Your opportunity is live for verified organizations.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Unknown error';
      Alert.alert('Publish failed', msg);
    }
  }, [
    address,
    ageMinStr,
    causes,
    city,
    createMutation,
    dateStr,
    endTimeStr,
    isCreditEligible,
    isRecurring,
    latStr,
    lngStr,
    router,
    startTimeStr,
    state,
    title,
    totalSpotsStr,
    whatToBringList,
  ]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What&apos;s the role?</Text>
            <TextInput
              style={styles.input}
              placeholder="Role title"
              placeholderTextColor={Colors.dark.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.fieldLabel}>Causes</Text>
            <View style={styles.causeGrid}>
              {CAUSES.map(c => (
                <Pressable
                  key={c}
                  onPress={() => toggleCause(c)}
                  style={[
                    styles.causeChip,
                    causes.includes(c) && {
                      backgroundColor: Colors.causeTags[c] + '25',
                      borderColor: Colors.causeTags[c],
                    },
                  ]}
                >
                  <Text style={[styles.causeText, causes.includes(c) && { color: Colors.causeTags[c] }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When?</Text>
            <TextInput
              style={styles.input}
              placeholder="Date YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textTertiary}
              value={dateStr}
              onChangeText={setDateStr}
            />
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Start HH:MM"
                placeholderTextColor={Colors.dark.textTertiary}
                value={startTimeStr}
                onChangeText={setStartTimeStr}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="End HH:MM"
                placeholderTextColor={Colors.dark.textTertiary}
                value={endTimeStr}
                onChangeText={setEndTimeStr}
              />
            </View>
            <Pressable
              onPress={() => setIsRecurring(prev => !prev)}
              style={[styles.recurringToggle, isRecurring && styles.toggleActive]}
            >
              <Text style={[styles.recurringText, isRecurring && styles.toggleTextActive]}>
                {isRecurring ? '☑' : '☐'} Recurring event
              </Text>
            </Pressable>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Where?</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              placeholderTextColor={Colors.dark.textTertiary}
              value={address}
              onChangeText={setAddress}
            />
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="City"
                placeholderTextColor={Colors.dark.textTertiary}
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="State"
                placeholderTextColor={Colors.dark.textTertiary}
                value={state}
                onChangeText={setState}
              />
            </View>
            <Text style={styles.fieldLabel}>Coordinates (for GPS check-in)</Text>
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Latitude"
                placeholderTextColor={Colors.dark.textTertiary}
                value={latStr}
                onChangeText={setLatStr}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Longitude"
                placeholderTextColor={Colors.dark.textTertiary}
                value={lngStr}
                onChangeText={setLngStr}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Requirements</Text>
            <View style={styles.timeRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Total spots"
                placeholderTextColor={Colors.dark.textTertiary}
                keyboardType="number-pad"
                value={totalSpotsStr}
                onChangeText={setTotalSpotsStr}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Min age (optional)"
                placeholderTextColor={Colors.dark.textTertiary}
                keyboardType="number-pad"
                value={ageMinStr}
                onChangeText={setAgeMinStr}
              />
            </View>
            <Text style={styles.fieldLabel}>What to bring (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="Water bottle, Snacks"
              placeholderTextColor={Colors.dark.textTertiary}
              value={whatToBringLine}
              onChangeText={setWhatToBringLine}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Preview & publish</Text>
            <Card style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title || 'Untitled role'}</Text>
              <View style={styles.previewTags}>
                {causes.map(c => (
                  <View key={c} style={[styles.previewTag, { backgroundColor: Colors.causeTags[c] + '22' }]}>
                    <Text style={[styles.previewTagText, { color: Colors.causeTags[c] }]}>{c}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.previewMeta}>
                {dateStr || '—'} · {startTimeStr}–{endTimeStr}
              </Text>
              <Text style={styles.previewMeta} numberOfLines={2}>
                {address || 'Address not set'}
              </Text>
              <Pressable
                onPress={() => setIsCreditEligible(prev => !prev)}
                style={[styles.creditToggle, isCreditEligible && styles.toggleActive]}
              >
                <Text style={[styles.creditToggleText, isCreditEligible && styles.toggleTextActive]}>
                  {isCreditEligible ? '☑' : '☐'} Credit eligible
                </Text>
              </Pressable>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Post a role</Text>
        <View style={{ width: 40 }} />
      </View>
      <ProgressBar steps={totalSteps} currentStep={step} accent="purple" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View key={`create-role-step-${step}`} entering={enterRise(70)}>
          {renderStep()}
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {step > 0 && (
            <PillButton variant="ghost" size="medium" onPress={() => setStep(s => s - 1)} style={{ flex: 1 }}>
              Back
            </PillButton>
          )}
          <PillButton
            variant="primary"
            accent="purple"
            size="large"
            onPress={() => (step < totalSteps - 1 ? setStep(s => s + 1) : publish())}
            style={{ flex: 2 }}
            disabled={createMutation.isPending}
          >
            {step < totalSteps - 1 ? (
              'Continue'
            ) : createMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : isLiveMode() ? (
              'Publish'
            ) : (
              'Close'
            )}
          </PillButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 20 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: Colors.dark.textPrimary },
  headerTitle: { fontSize: 17, fontWeight: '500', color: Colors.dark.textPrimary },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32 },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 24, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  input: { backgroundColor: Colors.dark.element, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, color: Colors.dark.textPrimary },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  causeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  causeChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: Colors.dark.element, borderWidth: 1.5, borderColor: 'transparent' },
  causeText: { fontSize: 14, fontWeight: '500', color: Colors.dark.textSecondary },
  timeRow: { flexDirection: 'row', gap: 12 },
  recurringToggle: { paddingVertical: 8 },
  recurringText: { fontSize: 15, color: Colors.dark.textSecondary },
  mapPlaceholder: { height: 180, borderRadius: 20, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapIcon: { fontSize: 32 },
  mapText: { fontSize: 14, color: Colors.dark.textSecondary },
  previewCard: { borderRadius: 20, gap: 12 },
  previewTitle: { fontSize: 18, fontWeight: '500', color: Colors.dark.textPrimary },
  previewTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  previewTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  previewTagText: { fontSize: 13, fontWeight: '500' },
  previewMeta: { fontSize: 14, color: Colors.dark.textSecondary },
  creditToggle: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.dark.element },
  creditToggleText: { fontSize: 15, color: Colors.dark.textSecondary },
  toggleActive: {
    borderRadius: 12,
    backgroundColor: Colors.purpleSoft,
    paddingHorizontal: 10,
  },
  toggleTextActive: {
    color: Colors.purple,
    fontWeight: '500',
  },
  footer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  footerButtons: { flexDirection: 'row', gap: 12 },
});
