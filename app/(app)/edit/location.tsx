import LocationSearchBar from '@/src/components/LocationSearchBar';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { ILocation } from '@/src/interfaces/location';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { Location } from '@/src/types/location';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const LocationScreen: React.FC = () => {
  const { user, isLoading, updateLocation } = useEdit();
  const { colors } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null,
  );

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Location"
        colors={colors}
        save={save}
        isSaving={isLoading}
        isDisabled={!selectedLocation && !user?.profile?.location}
      />
      <LocationSearchBar
        onSelect={handleLocationSelect}
        selectedLocation={selectedLocation}
        colors={colors}
      />
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
  },
  map: {
    width: Dimensions.get('window').width - 20, // Adjust width as needed
    height: 300, // Adjust height as needed
    borderRadius: 10,
    alignSelf: 'center',
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
