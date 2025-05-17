import React, { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { styles } from './styles';
import { IdentifierProps } from './types';

import MailIcon from '@/src/icons/MailIcon';
import PhoneIcon from '@/src/icons/PhoneIcon';

import MobileNumberInput from '../MobileNumber/MobileNumber';
import SegmentedToggle from '../SegmentedToggle';
import { EcohInput } from '../../atoms/EcohInput/EcohInput';

const Identifier: React.FC<IdentifierProps> = ({
  isEmail,
  toggleInputMode,
  formik,
  onCountryChange,
}) => {
  const emailOpacity = useSharedValue(isEmail ? 1 : 0);
  const mobileOpacity = useSharedValue(isEmail ? 0 : 1);

  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (isEmail) {
      emailOpacity.value = withTiming(1, { duration: 160 });
      mobileOpacity.value = withTiming(0, { duration: 160 });
    } else {
      emailOpacity.value = withTiming(0, { duration: 160 });
      mobileOpacity.value = withTiming(1, { duration: 160 });
    }
  }, [isEmail]);

  const emailStyle = useAnimatedStyle(() => ({
    opacity: emailOpacity.value,
    position: 'absolute',
    width: '100%',
    pointerEvents: emailOpacity.value > 0.5 ? 'auto' : 'none',
  }));

  const mobileStyle = useAnimatedStyle(() => ({
    opacity: mobileOpacity.value,
    position: 'absolute',
    width: '100%',
    pointerEvents: mobileOpacity.value > 0.5 ? 'auto' : 'none',
  }));

  const handleToggle = (index: number) => {
    const wantsEmail = index === 1;
    if (wantsEmail !== isEmail) {
      toggleInputMode();
    }
  };

  const handleLayout = (e: LayoutChangeEvent, type: 'email' | 'mobile') => {
    if ((type === 'email' && isEmail) || (type === 'mobile' && !isEmail)) {
      setContainerHeight(e.nativeEvent.layout.height);
    }
  };

  return (
    <View style={styles.wrapper}>
      <SegmentedToggle
        options={[
          { label: 'Mobile', icon: <PhoneIcon size={18} /> },
          { label: 'Email', icon: <MailIcon size={18} /> },
        ]}
        activeIndex={isEmail ? 1 : 0}
        onChange={handleToggle}
      />

      <View
        style={{ height: containerHeight || undefined, position: 'relative' }}
      >
        <Animated.View
          onLayout={(e) => handleLayout(e, 'email')}
          style={emailStyle}
        >
          <EcohInput
            label="Email"
            name="email"
            formik={formik}
            icon={(color) => <MailIcon size={24} color={color} />}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            importantForAutofill="yes"
            helperText="Email"
          />
        </Animated.View>

        <Animated.View
          onLayout={(e) => handleLayout(e, 'mobile')}
          style={mobileStyle}
        >
          <MobileNumberInput
            label="Mobile Number"
            name="mobile"
            formik={formik}
            initialCountry="GB"
            onCountryChange={onCountryChange}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(Identifier);
