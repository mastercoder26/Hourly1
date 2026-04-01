// Web-specific grid layout for opportunity feed
import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Opportunity } from '../../types';
import { WebOpportunityCard } from './WebOpportunityCard';
import { listAnimations } from '../../lib/motion';

interface WebOpportunityGridProps {
  opportunities: Opportunity[];
  layout?: 'grid' | 'list' | 'masonry';
}

export function WebOpportunityGrid({ opportunities, layout = 'grid' }: WebOpportunityGridProps) {
  const { width } = useWindowDimensions();
  
  // Determine number of columns based on screen width
  const getColumns = () => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1400) return 3;
    return 3;
  };

  const columns = getColumns();

  if (layout === 'list') {
    return (
      <View style={styles.list}>
        {opportunities.map((opportunity, index) => (
          <Animated.View 
            key={opportunity.id} 
            entering={listAnimations.itemEnter(index)}
            style={styles.listItem}
          >
            <WebOpportunityCard opportunity={opportunity} layout="row" />
          </Animated.View>
        ))}
      </View>
    );
  }

  // Grid layout - use flexbox for cross-platform compatibility
  return (
    <View style={[styles.grid, { gap: columns > 1 ? 20 : 16 }]}>
      {opportunities.map((opportunity, index) => (
        <Animated.View
          key={opportunity.id}
          entering={listAnimations.gridEnter(index, columns)}
          style={[
            styles.gridItem,
            // Responsive width based on columns
            { 
              width: Platform.OS === 'web' && columns > 1 
                ? `${100 / columns - 2}%` as any
                : '100%' 
            },
          ]}
        >
          <WebOpportunityCard opportunity={opportunity} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 20,
  },
  gridItem: {
    minWidth: 300,
    maxWidth: 400,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  listItem: {
    // Row items stretch full width
  },
});

export default WebOpportunityGrid;
