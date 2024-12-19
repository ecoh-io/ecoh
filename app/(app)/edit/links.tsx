import React, { useMemo, useCallback, useState, useRef } from 'react';
import {
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import SocialChip from '@/src/components/atoms/socialChip';
import {
  SOCIAL_PLATFORMS,
  SocialPlatform,
} from '@/src/constants/SocialPlatforms';
import { useTheme } from '@/src/theme/ThemeContext';
import Button from '@/src/UI/Button';
import { FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Header from '@/src/components/Profile/Edit/Header';
import { typography } from '@/src/theme/typography';
import { useEdit } from '@/src/context/EditContext';

interface SocialLinksState {
  [platformKey: string]: string;
}

const MAX_LINKS = 5;

const Links: React.FC = () => {
  const { user, isLoading, updateLinks } = useEdit();
  const { colors } = useTheme();

  const [links, setLinks] = useState<SocialLinksState>(
    user?.profile.links || {},
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  // Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for Bottom Sheet
  const snapPoints = useMemo(() => ['50%'], []);

  // Available platforms excluding already linked ones
  const availablePlatforms = useMemo(
    () =>
      SOCIAL_PLATFORMS.filter(
        (platform) => !links.hasOwnProperty(platform.key),
      ),
    [links],
  );

  // State to manage current view inside BottomSheet
  const [currentSheetView, setCurrentSheetView] = useState<
    'platformSelection' | 'usernameInput'
  >('platformSelection');

  // Handler to open the Bottom Sheet
  const handleAddLink = useCallback(() => {
    setCurrentSheetView('platformSelection');
    bottomSheetRef.current?.expand();
  }, []);

  // Handler when a platform is selected
  const handlePlatformSelect = useCallback((platformKey: string) => {
    setSelectedPlatform(platformKey);
    setCurrentSheetView('usernameInput');
  }, []);

  // Function to add or update a social link
  const addOrUpdateLink = useCallback(
    (platformKey: string, username: string) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
      if (!platform) {
        return;
      }

      const link = platform.baseUrl
        ? platform.baseUrl.replace('{username}', encodeURIComponent(username))
        : username;

      setLinks((prevLinks) => {
        const updatedLinks = {
          ...prevLinks,
          [platform.key]: link,
        };

        return updatedLinks;
      });
    },
    [user],
  );

  // Handler to submit the username and add/update the link
  const handleUsernameSubmit = useCallback(() => {
    if (!selectedPlatform) {
      return;
    }

    if (!username.trim()) {
      return;
    }

    addOrUpdateLink(selectedPlatform, username.trim());
    setUsername('');
    setSelectedPlatform(null);
    bottomSheetRef.current?.close();
    Keyboard.dismiss();
  }, [selectedPlatform, username, addOrUpdateLink]);

  // Handler to remove a social link
  const handleRemoveLink = useCallback(
    (platformKey: string) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
      if (!platform) {
        return;
      }

      setLinks((prevLinks) => {
        const updatedLinks = { ...prevLinks };
        delete updatedLinks[platformKey];
        // Update the user in the global store

        return updatedLinks;
      });
    },
    [user],
  );

  // Render each platform item in the selection view
  const renderPlatformItem = useCallback(
    ({ item }: { item: SocialPlatform }) => (
      <TouchableOpacity
        style={styles.platformItem}
        onPress={() => handlePlatformSelect(item.key)}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Select ${item.name}`}
      >
        <FontAwesome6 name={item.icon} size={24} color={colors.text} />
        <Text style={[styles.platformName, { color: colors.text }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [handlePlatformSelect, colors.text],
  );

  const save = useCallback(() => {
    const linksToSave = Object.keys(links).length > 0 ? links : null;
    updateLinks(linksToSave);
  }, [links, updateLinks]);

  const keyExtractor = useCallback((item: SocialPlatform) => item.key, []);

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="Links"
          colors={colors}
          save={save}
          isSaving={isLoading}
          isDisabled={isLoading}
        />
        <Text style={styles.info}>
          {`You can add up to ${MAX_LINKS} external links`}
        </Text>
        <View style={styles.socialLinksContainer}>
          {/* Add Social Link Button */}

          <Button
            variant="primary"
            size="small"
            shape="pill"
            disabled={Object.keys(links).length >= MAX_LINKS}
            gradientColors={['#00c6ff', '#0072ff']}
            icon={
              <FontAwesome6 name="plus" size={18} color={colors.onGradient} />
            }
            onPress={handleAddLink}
            contentStyle={{ paddingVertical: 14 }}
          />

          {Object.keys(links).length > 0 ? (
            <View style={styles.chipsContainer}>
              {Object.entries(links).map(([platformKey, link]) => {
                const platform = SOCIAL_PLATFORMS.find(
                  (p) => p.key === platformKey,
                );
                if (!platform) return null;
                return (
                  <SocialChip
                    key={platformKey}
                    label={platform.name}
                    iconName={platform.icon}
                    onDelete={() => handleRemoveLink(platformKey)}
                    colors={colors}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={[styles.noLinksText, { color: colors.text }]}>
              Add external links
            </Text>
          )}
        </View>
      </View>

      {/* Platform Selection Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        animateOnMount={false}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            Select a Platform
          </Text>
          <FlatList
            data={availablePlatforms}
            keyExtractor={keyExtractor}
            renderItem={renderPlatformItem}
            contentContainerStyle={styles.platformList}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={21}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps="handled"
          />
        </BottomSheetView>
      </BottomSheet>

      {/* Username Input Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Ensure the sheet is closed initially
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        animateOnMount={false}
        style={styles.bottomSheet} // Apply shadow styles here
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {currentSheetView === 'platformSelection' && (
            <>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Select a Platform
              </Text>
              {availablePlatforms.length > 0 ? (
                <FlatList
                  data={availablePlatforms}
                  keyExtractor={keyExtractor}
                  renderItem={renderPlatformItem}
                  contentContainerStyle={styles.platformList}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={21}
                  removeClippedSubviews={true}
                  keyboardShouldPersistTaps="handled"
                />
              ) : (
                <Text style={[styles.noLinksText, { color: colors.text }]}>
                  No available platforms to add.
                </Text>
              )}
            </>
          )}

          {currentSheetView === 'usernameInput' && selectedPlatform && (
            <>
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>
                  Add{' '}
                  {
                    SOCIAL_PLATFORMS.find((p) => p.key === selectedPlatform)
                      ?.name
                  }{' '}
                  Link
                </Text>
                <Button
                  title="Add"
                  variant="primary"
                  size="small"
                  shape="rounded"
                  gradientColors={['#00c6ff', '#0072ff']}
                  onPress={handleUsernameSubmit}
                  disabled={!username.trim()}
                  accessibilityLabel="Save Social Link"
                />
              </View>

              {/* Selected Platform Display */}
              <View style={styles.platformItem}>
                <FontAwesome6
                  name={
                    SOCIAL_PLATFORMS.find((p) => p.key === selectedPlatform)
                      ?.icon
                  }
                  size={24}
                  color={colors.text}
                />
                <Text style={[styles.platformName, { color: colors.text }]}>
                  {
                    SOCIAL_PLATFORMS.find((p) => p.key === selectedPlatform)
                      ?.name
                  }
                </Text>
              </View>

              {/* Username Input */}
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.highlight,
                    color: colors.text,
                  },
                ]}
                placeholder="Username"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={setUsername}
                returnKeyType="done"
                onSubmitEditing={handleUsernameSubmit}
                autoFocus
                accessible
                accessibilityLabel="Username Input"
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Links;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    flex: 1,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  platformName: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Medium', // Adjust according to your typography
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // Shadow upwards
    },
    shadowOpacity: 0.05, // Lower opacity for subtle shadow
    shadowRadius: 3,
    // Android Shadow
    elevation: 3, // Lower elevation for subtle shadow
    borderRadius: 16,
    overflow: 'hidden', // Important for rounded corners
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold', // Adjust according to your typography
    marginBottom: 16,
  },
  platformList: {
    // Additional styling if needed
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', // Adjust according to your typography
  },
  noLinksText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.body,
    alignSelf: 'center',
  },
  info: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 13,
    paddingHorizontal: 4,
  },
});
