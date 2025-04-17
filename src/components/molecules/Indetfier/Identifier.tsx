import React from 'react';
import { View } from 'react-native';
import MailIcon from '@/src/icons/MailIcon';
import { styles } from './styles';
import { IdentifierProps } from './types';
import MobileNumber from '../MobileNumber';
import SegmentedToggle from '../SegmentedToggle';
import { Input } from '../../atoms';

const Identifier: React.FC<IdentifierProps> = ({
  emailRef,
  mobileRef,
  isEmail,
  toggleInputMode,
  iconColor,
  countryCode,
  formik,
  handleCountryCodePress,
  handleMobileChange,
  showCountryPicker,
  setShowCountryPicker,
  handleCountrySelect,
}) => {
  const handleToggle = (index: number) => {
    if ((isEmail && index === 0) || (!isEmail && index === 1)) {
      toggleInputMode();
    }
  };

  const error = formik.touched.identifier
    ? formik.errors.identifier
    : undefined;

  return (
    <View style={styles.wrapper}>
      <SegmentedToggle
        options={['Mobile', 'Email']}
        activeIndex={isEmail ? 1 : 0}
        onChange={handleToggle}
      />

      {isEmail ? (
        <Input
          ref={emailRef}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formik.values.identifier}
          onChangeText={formik.handleChange('identifier')}
          onBlur={formik.handleBlur('identifier')}
          error={error}
          LeftAccessory={() => (
            <View style={styles.icon}>
              <MailIcon size={24} color={iconColor} />
            </View>
          )}
        />
      ) : (
        <MobileNumber
          ref={mobileRef}
          value={formik.values.identifier}
          countryCode={countryCode}
          onCountryCodePress={handleCountryCodePress}
          onChangeText={handleMobileChange}
          onBlur={formik.handleBlur('identifier')}
          error={error}
          showCountryPicker={showCountryPicker}
          setShowCountryPicker={setShowCountryPicker}
          handleCountrySelect={handleCountrySelect}
        />
      )}
    </View>
  );
};

export default React.memo(Identifier);
