import LocationSearchBar from '@/src/components/LocationSearchBar';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { ILocation } from '@/src/interfaces/location';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { Location } from '@/src/types/location';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
const LocationScreen: React.FC = () => {
  const { user, isLoading, updateLocation } = useEdit();
  const { colors } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<ILocation>({
    city: '',
    longitude: 0,
    latitude: 0,
    region: '',
  });
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (user?.profile?.location && user.profile.city && user.profile.region) {
      const [longitude, latitude] = user.profile.location.coordinates;
      const city = user.profile.city;
      const region = user.profile.region;
      setSelectedLocation({ city, longitude, latitude, region });
    }
  }, [user]);

  const save = useCallback(() => {
    if (selectedLocation) {
      const pointData: Location = {
        type: 'Point',
        coordinates: [selectedLocation.longitude, selectedLocation.latitude],
      };
      updateLocation(pointData, selectedLocation.city, selectedLocation.region);
    } else {
      updateLocation(null, null, null);
    }
  }, [selectedLocation, updateLocation]);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleSearchStart = () => {
    setIsSearching(!isSearching);
  };

  const initialRegion: Region = {
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Location"
        colors={colors}
        save={save}
        isSaving={isLoading}
        isDisabled={!selectedLocation && !user?.profile?.location}
      />
      <View style={styles.searchBarContainer}>
        <LocationSearchBar
          onSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          colors={colors}
          onSearchStart={handleSearchStart}
        />
      </View>
      {!isSearching && selectedLocation && (
        <View>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            region={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            liteMode={true} // Lite mode is used to reduce memory usage
          />
          <View style={styles.locationDetails}>
            <Text style={styles.city}>{selectedLocation.city}</Text>
            <Text style={[styles.region, { color: colors.secondary }]}>
              {selectedLocation.region}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 12,
  },
  map: {
    width: Dimensions.get('window').width - 25, // Adjust width as needed
    height: 200, // Adjust height as needed
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  locationDetails: {
    flexDirection: 'column',
    gap: 5,
    paddingVertical: 12,
  },
  searchBarContainer: {
    marginTop: 10,
  },
  city: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  region: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.smallTitle,
  },
});
