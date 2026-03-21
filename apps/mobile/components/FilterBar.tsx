import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { TextSub, TextRegular } from './ui/Typography';

export function FilterBar({ onToggleMap }: { onToggleMap: () => void }) {
  const [creditToggle, setCreditToggle] = useState(false);

  return (
    <View className="bg-white dark:bg-[#1C1C1E] border-b border-grayBorder px-4 py-3 z-10">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
        <TouchableOpacity className="px-4 py-2 rounded-pill bg-[#F7F7F5] dark:bg-[#2C2C2E]">
          <TextRegular>Distance: 5mi</TextRegular>
        </TouchableOpacity>
        
        <TouchableOpacity className="px-4 py-2 rounded-pill bg-[#F7F7F5] dark:bg-[#2C2C2E]">
          <TextRegular>All Causes</TextRegular>
        </TouchableOpacity>

        <TouchableOpacity className="px-4 py-2 rounded-pill bg-[#F7F7F5] dark:bg-[#2C2C2E]">
          <TextRegular>Any Date</TextRegular>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 px-3 py-1 rounded-pill bg-[#F7F7F5] dark:bg-[#2C2C2E]">
          <TextRegular>Credit Only</TextRegular>
          <Switch 
            value={creditToggle} 
            onValueChange={setCreditToggle}
            trackColor={{ false: "#888888", true: "#1D9E75" }}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>

        <TouchableOpacity 
          onPress={onToggleMap}
          className="px-4 py-2 rounded-pill border border-teal"
        >
          <TextRegular className="text-teal">Map View</TextRegular>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
