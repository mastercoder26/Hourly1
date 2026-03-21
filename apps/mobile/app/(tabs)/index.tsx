import { View, FlatList } from 'react-native';
import { useState } from 'react';
import { mockOpportunities } from '../../mocks/opportunities';
import { OpportunityCard } from '../../components/OpportunityCard';
import { FilterBar } from '../../components/FilterBar';
import { TextValueLarge, TextRegular } from '../../components/ui/Typography';

export default function FeedScreen() {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <View className="flex-1 bg-offWhite dark:bg-black pt-12">
      <View className="px-4 pb-4">
        <TextValueLarge>Find a role</TextValueLarge>
      </View>
      <FilterBar onToggleMap={() => setIsMapView(!isMapView)} />

      {isMapView ? (
        <View className="flex-1 items-center justify-center px-4">
          <TextRegular className="text-textMuted text-center">
            Map view is currently unavailable.
          </TextRegular>
        </View>
      ) : (
        <FlatList
          data={mockOpportunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OpportunityCard item={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
              <TextRegular className="text-textMuted">Try adjusting your filters</TextRegular>
            </View>
          }
        />
      )}
    </View>
  );
}
