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
import { Input } from '@/src/components/atoms';
import { styles } from './styles';
import { LocationSearchProps } from './types';
import { ILocation } from '@/src/interfaces/location';

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
        <Text style={styles.searchResult}>
          {`${item.city}, ${item.region}`}
        </Text>
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

export default React.memo(LocationSearchBar);
