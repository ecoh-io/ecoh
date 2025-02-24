import React, { useMemo, useCallback, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SocialChip from '@/src/components/atoms/socialChip';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';
import { useTheme } from '@/src/theme/ThemeContext';
import Button from '@/src/UI/Button';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import Header from '@/src/components/Profile/Edit/Header';
import { typography } from '@/src/theme/typography';
import { useEdit } from '@/src/context/EditContext';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import FormikEcohDropdown from '@/src/UI/Dropdown/FormikDropdown';
import {
  AnimatedWrapper,
  AnimationType,
} from '@/src/components/Animations/Animations';
import Input from '@/src/UI/Input';

interface SocialLinksState {
  [platformKey: string]: string;
}

const MAX_LINKS = 7;

const Links: React.FC = () => {
  const { user, isLoading, updateLinks } = useEdit();
  const { colors } = useTheme();

  const [links, setLinks] = useState<SocialLinksState>(
    user?.profile.socialLinks || {},
  );
  const [isFormVisible, setFormVisible] = useState(false);
  const [isFormClosed, setIsFormClosed] = useState(true);

  // Compute available platforms (exclude already linked)
  const availablePlatforms = useMemo(
    () =>
      SOCIAL_PLATFORMS.filter(
        (platform) => !links.hasOwnProperty(platform.key),
      ),
    [links],
  );

  const formik = useFormik({
    initialValues: {
      platform: '',
      username: '',
    },
    validationSchema: Yup.object({
      platform: Yup.string().required('Platform is required'),
      username: Yup.string().required('Username is required'),
    }),
    onSubmit: (values) => {
      setLinks((prevLinks) => ({
        ...prevLinks,
        [values.platform]: values.username,
      }));
      setFormVisible(false);
      formik.resetForm();
    },
  });

  const handleAddLink = () => {
    setFormVisible(!isFormVisible);
    setIsFormClosed(!isFormClosed);
  };

  const handleDeleteLink = (platformKey: string) => {
    setLinks((prevLinks) => {
      const updatedLinks = { ...prevLinks };
      delete updatedLinks[platformKey];
      return updatedLinks;
    });
  };

  const save = useCallback(() => {
    const linksToSave = Object.keys(links).length > 0 ? links : null;
    updateLinks(linksToSave);
  }, [links, updateLinks]);

  const animationSettings: {
    enterAnimation: AnimationType;
    exitAnimation: AnimationType;
  } = React.useMemo(
    () => ({
      enterAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      duration: 600,
    }),
    [],
  );

  const animationButtonIconSettings: {
    enterAnimation: AnimationType;
    exitAnimation: AnimationType;
  } = React.useMemo(
    () => ({
      enterAnimation: 'plus-to-cross',
      exitAnimation: 'cross-to-plus',
      duration: 600,
      initial: { opacity: 1 },
    }),
    [],
  );

  const iconColor = useMemo(() => {
    if (formik.errors.username && formik.touched.username) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.username, formik.touched.username]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header
          title="Links"
          colors={colors}
          save={save}
          isSaving={isLoading}
          isDisabled={isLoading}
        />
        <View style={styles.socialLinksContainer}>
          {/* Button to add a new social link */}
          <Button
            variant="primary"
            size="small"
            shape="rounded"
            disabled={Object.keys(links).length >= MAX_LINKS}
            gradientColors={['#00c6ff', '#0072ff']}
            icon={
              <AnimatedWrapper
                {...animationButtonIconSettings}
                visible={isFormClosed}
              >
                <FontAwesome6
                  name={'plus'}
                  size={18}
                  color={colors.onGradient}
                />
              </AnimatedWrapper>
            }
            onPress={handleAddLink}
            contentStyle={{ paddingVertical: 12 }}
          />

          <Text style={styles.info}>
            {`Your Ecoh profile visitors can view your social links. You can add up to ${MAX_LINKS} links.`}
          </Text>
        </View>

        {Object.keys(links).length > 0 && (
          <View style={styles.chipsContainer}>
            {Object.entries(links).map(([platformKey, link]) => {
              const platform = SOCIAL_PLATFORMS.find(
                (p) => p.key === platformKey,
              );
              if (!platform) return null;
              return (
                <AnimatedWrapper {...animationSettings} key={platformKey}>
                  <SocialChip key={platformKey} platform={platform} />
                </AnimatedWrapper>
              );
            })}
          </View>
        )}

        <AnimatedWrapper
          {...animationSettings}
          visible={isFormVisible}
          style={styles.formContainer}
        >
          <FormikProvider value={formik}>
            <FormikEcohDropdown
              options={availablePlatforms.map((platform) => ({
                id: platform.key,
                label: platform.name,
                value: platform.key,
              }))}
              name="platform"
              placeholder="Platform"
            />
            <AnimatedWrapper
              {...animationSettings}
              visible={!!formik.values.platform}
            >
              <Input
                placeholder="Username"
                value={formik.values.username}
                onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
                error={
                  formik.touched.username ? formik.errors.username : undefined
                }
                LeftAccessory={() => (
                  <Ionicons
                    name="person"
                    size={26}
                    color={iconColor}
                    style={styles.icon}
                  />
                )}
              />
            </AnimatedWrapper>
          </FormikProvider>
        </AnimatedWrapper>
      </View>
      <AnimatedWrapper
        {...animationSettings}
        visible={isFormVisible}
        style={styles.buttonWrapper}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            title="Cancel"
            onPress={() => formik.handleSubmit()}
            variant="secondary"
            size="large"
            style={{ flex: 1 }}
          />
          <Button
            variant="primary"
            title="Add"
            size="large"
            style={{ flex: 1 }}
            onPress={() => formik.handleSubmit()}
            gradientColors={['#00c6ff', '#0072ff']}
            icon={
              <FontAwesome6 name={'plus'} size={18} color={colors.onGradient} />
            }
          />
        </View>
      </AnimatedWrapper>
    </View>
  );
};

export default Links;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 12,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  container: {
    flexDirection: 'column',
    gap: 10,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  info: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 13,
    paddingHorizontal: 4,
    flexShrink: 1, // Allow text to shrink to fit within the container
    width: '100%',
    alignSelf: 'center',
  },
  formContainer: {
    flexDirection: 'column',
    gap: 20,
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexGrow: 0,
    paddingVertical: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'transparent', // You might want to set this to match your background
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,
  },
  formTitle: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.title,
  },
});
