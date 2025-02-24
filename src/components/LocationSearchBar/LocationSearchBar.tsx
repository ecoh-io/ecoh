import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Text,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useLocationSearch from './useLocationSearchBar';
import Input from '@/src/UI/Input';
import { typography } from '@/src/theme/typography';
import { Colors } from '@/src/types/color';
import { ILocation } from '@/src/interfaces/location';

interface LocationSearchProps {
  onSelect: (item: ILocation) => void;
  colors: Colors;
  selectedLocation?: ILocation | null;
  onSearchStart: () => void;
}

const LocationSearchBar: React.FC<LocationSearchProps> = ({
  onSelect,
  colors,
  selectedLocation,
  onSearchStart,
}) => {
  const {
    query,
    handleChange,
    locations,
    loading,
    setQuery,
    setLocations,
    cancelFetch,
  } = useLocationSearch();

  useEffect(() => {
    if (selectedLocation) {
      setQuery(`${selectedLocation.city}, ${selectedLocation.region}`);
    }
  }, [selectedLocation, setQuery]);

  const handleSelect = useCallback(
    (item: ILocation) => {
      cancelFetch();
      setQuery(`${item.city}, ${item.region}`);
      onSelect(item);
      setLocations([]);
      Keyboard.dismiss();
    },
    [onSelect],
  );

  const LocationListItem = React.memo(
    ({
      item,
      onSelect,
    }: {
      item: ILocation;
      onSelect: (item: ILocation) => void;
    }) => (
      <TouchableOpacity onPress={() => onSelect(item)} style={styles.listItem}>
        <Text
          style={styles.searchResult}
        >{`${item.city}, ${item.region}`}</Text>
      </TouchableOpacity>
    ),
  );

  const renderItem = useCallback(
    ({ item }: { item: ILocation }) => (
      <LocationListItem item={item} onSelect={handleSelect} />
    ),
    [handleSelect],
  );

  const keyExtractor = useCallback(
    (item: ILocation) =>
      `${item.city}-${item.region}-${item.latitude}-${item.longitude}`,
    [],
  );

  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={handleChange}
        onFocus={onSearchStart}
        onBlur={onSearchStart}
        placeholder="Enter city or region"
        LeftAccessory={() => (
          <FontAwesome
            name="search"
            size={24}
            color={colors.secondary}
            style={styles.icon}
          />
        )}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {loading && query.length >= 3 ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  icon: {
    alignSelf: 'center',
    marginLeft: 6,
  },
  loader: {
    marginVertical: 10,
  },
  listItem: {
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    zIndex: 1000,
  },
  searchResult: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default React.memo(LocationSearchBar);
