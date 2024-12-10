import LocationSearchBar from '@/src/components/LocationSearchBar';
import Header from '@/src/components/Profile/Edit/Header';
import { ILocation } from '@/src/interfaces/location';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const Location: React.FC = () => {
  const { colors } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null,
  );

  const save = () => {
    console.log('Saving location');
  };

  const handleLocationSelect = (location: any) => {
    console.log('Selected location:', location);
    setSelectedLocation(location);
  };

  //   const initialRegion: Region = {
  //     latitude: selectedLocation ? selectedLocation.latitude : 37.78825, // Default latitude
  //     longitude: selectedLocation ? selectedLocation.longitude : -122.4324, // Default longitude
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Location"
        colors={colors}
        save={save}
        isSaving={false}
        isDisabled={false}
      />
      <LocationSearchBar onSelect={handleLocationSelect} colors={colors} />
      {/* {selectedLocation && (
        // <MapView
        //   style={styles.map}
        //   initialRegion={initialRegion}
        //   region={{
        //     latitude: selectedLocation.latitude,
        //     longitude: selectedLocation.longitude,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        //   }}
        // />
        <View>
          <Text style={styles.city}>{selectedLocation.city}</Text>
          <Text style={[styles.region, { color: colors.secondary }]}>
            {selectedLocation.region}
          </Text>
        </View>
      )} */}
    </View>
  );
};

export default Location;

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
