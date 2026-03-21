// Create Role — multi-step form for posting volunteer opportunities
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { CauseTag } from '../../types';

const CAUSES: CauseTag[] = ['Environment', 'Education', 'Food', 'Animals', 'Seniors', 'Youth', 'Health', 'Arts'];

export default function CreateRoleScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [causes, setCauses] = useState<CauseTag[]>([]);
  const totalSteps = 5;

  const toggleCause = (c: CauseTag) => {
    setCauses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's the role?</Text>
            <TextInput style={styles.input} placeholder="Role title" placeholderTextColor={Colors.dark.textTertiary} value={title} onChangeText={setTitle} />
            <Text style={styles.fieldLabel}>Causes</Text>
            <View style={styles.causeGrid}>
              {CAUSES.map(c => (
                <Pressable key={c} onPress={() => toggleCause(c)} style={[styles.causeChip, causes.includes(c) && { backgroundColor: Colors.causeTags[c] + '25', borderColor: Colors.causeTags[c] }]}>
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
            <TextInput style={styles.input} placeholder="Date (e.g., 2026-04-15)" placeholderTextColor={Colors.dark.textTertiary} />
            <View style={styles.timeRow}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Start time" placeholderTextColor={Colors.dark.textTertiary} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="End time" placeholderTextColor={Colors.dark.textTertiary} />
            </View>
            <Pressable style={styles.recurringToggle}>
              <Text style={styles.recurringText}>☐ Recurring event</Text>
            </Pressable>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Where?</Text>
            <TextInput style={styles.input} placeholder="Address" placeholderTextColor={Colors.dark.textTertiary} />
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapIcon}>📍</Text>
              <Text style={styles.mapText}>Map pin confirmation</Text>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Requirements</Text>
            <View style={styles.timeRow}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Total spots" placeholderTextColor={Colors.dark.textTertiary} keyboardType="number-pad" />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Min age" placeholderTextColor={Colors.dark.textTertiary} keyboardType="number-pad" />
            </View>
            <Text style={styles.fieldLabel}>What to bring</Text>
            <TextInput style={styles.input} placeholder="Add item..." placeholderTextColor={Colors.dark.textTertiary} />
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
              <Pressable style={styles.creditToggle}>
                <Text style={styles.creditToggleText}>☐ Credit eligible</Text>
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
        {renderStep()}
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
            onPress={() => step < totalSteps - 1 ? setStep(s => s + 1) : router.back()}
            style={{ flex: 2 }}
          >
            {step < totalSteps - 1 ? 'Continue' : 'Publish'}
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
  creditToggle: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.dark.element },
  creditToggleText: { fontSize: 15, color: Colors.dark.textSecondary },
  footer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  footerButtons: { flexDirection: 'row', gap: 12 },
});
