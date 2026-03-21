import { View, FlatList, Dimensions } from 'react-native';
import { useState } from 'react';
import { mockOpportunities } from '../../mocks/opportunities';
import { OpportunityCard } from '../../components/OpportunityCard';
import { FilterBar } from '../../components/FilterBar';
import { TextValueLarge, TextRegular } from '../../components/ui/Typography';
import MapView, { Marker } from 'react-native-maps';

export default function FeedScreen() {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <View className="flex-1 bg-offWhite dark:bg-black pt-12">
      <View className="px-4 pb-4">
        <TextValueLarge>Find a role</TextValueLarge>
      </View>
      <FilterBar onToggleMap={() => setIsMapView(!isMapView)} />

      {isMapView ? (
        <MapView 
          style={{ flex: 1, width: Dimensions.get('window').width }}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {mockOpportunities.map(opp => (
            <Marker
              key={opp.id}
              coordinate={{ latitude: opp.latitude, longitude: opp.longitude }}
              title={opp.roleTitle}
              description={opp.orgName}
            />
          ))}
        </MapView>
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
