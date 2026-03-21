import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, TextValueLarge, TextRegular, TextCaption, TextSub, PillButton } from '../../components/ui';

const MOCK_APPLICANTS = [
  { id: '1', name: 'Sarah Jenkins', grade: '10th', hours: 42.5, status: 'approved', role: 'Seedling Planter' },
  { id: '2', name: 'Michael Chen', grade: '11th', hours: 15, status: 'pending', role: 'Seedling Planter' },
  { id: '3', name: 'Elena Rodriguez', grade: '12th', hours: 120, status: 'pending', role: 'Harvest Helper' },
  { id: '4', name: 'James Kim', grade: '10th', hours: 8, status: 'approved', role: 'Harvest Helper' },
  { id: '5', name: 'Priya Patel', grade: '11th', hours: 65, status: 'pending', role: 'Seedling Planter' },
];

const STATUS_COLORS: Record<string, string> = {
  approved: 'text-teal',
  pending: 'text-orange-500',
  declined: 'text-red-500',
};

const STATUS_BG: Record<string, string> = {
  approved: 'bg-[#1D9E7515]',
  pending: 'bg-orange-100 dark:bg-orange-900/20',
  declined: 'bg-red-100 dark:bg-red-900/20',
};

export default function ApplicantsTab() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_APPLICANTS.map(a => [a.id, a.status]))
  );

  const filtered = MOCK_APPLICANTS.filter(a =>
    filter === 'all' ? true : statuses[a.id] === filter
  );

  const approve = (id: string) => setStatuses(prev => ({ ...prev, [id]: 'approved' }));
  const decline = (id: string) => setStatuses(prev => ({ ...prev, [id]: 'declined' }));

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-5">
          <TextCaption className="text-purple font-bold uppercase tracking-widest mb-1">City Roots Farm</TextCaption>
          <TextValueLarge>Applicants</TextValueLarge>
          <TextRegular className="text-textMuted mt-1">{MOCK_APPLICANTS.length} total applicants</TextRegular>
        </View>

        {/* Filter pills */}
        <View className="flex-row gap-2 mb-6">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-pill border ${
                filter === f ? 'border-purple bg-[#534AB715]' : 'border-grayBorder bg-transparent'
              }`}
            >
              <TextCaption className={`font-medium capitalize ${filter === f ? 'text-purple' : 'text-textMuted'}`}>
                {f}
              </TextCaption>
            </TouchableOpacity>
          ))}
        </View>

        {/* Applicant Cards */}
        {filtered.map((applicant) => {
          const currentStatus = statuses[applicant.id];
          return (
            <Card key={applicant.id} className="p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full bg-[#534AB720] items-center justify-center mr-3">
                  <TextRegular className="text-purple font-bold text-[16px]">
                    {applicant.name.charAt(0)}
                  </TextRegular>
                </View>
                <View className="flex-1">
                  <TextRegular className="font-semibold">{applicant.name}</TextRegular>
                  <TextCaption className="mt-0.5">
                    {applicant.grade} Grade • {applicant.hours}h logged
                  </TextCaption>
                </View>
                <View className={`px-2 py-1 rounded-pill ${STATUS_BG[currentStatus] ?? ''}`}>
                  <TextCaption className={`font-medium capitalize ${STATUS_COLORS[currentStatus] ?? 'text-textMuted'}`}>
                    {currentStatus}
                  </TextCaption>
                </View>
              </View>

              <TextCaption className="mb-3 text-textMuted">Role: {applicant.role}</TextCaption>

              {currentStatus === 'pending' && (
                <View className="flex-row gap-2">
                  <PillButton
                    size="small"
                    label="Approve"
                    onPress={() => approve(applicant.id)}
                    variant="primary"
                    className="flex-1"
                  />
                  <PillButton
                    size="small"
                    label="Decline"
                    onPress={() => decline(applicant.id)}
                    variant="ghost"
                    className="flex-1"
                  />
                </View>
              )}
            </Card>
          );
        })}

        <View className="mb-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
