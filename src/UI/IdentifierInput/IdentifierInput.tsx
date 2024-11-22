import { Ionicons } from '@expo/vector-icons';
import Input from '../Input';
import Button from '../Button';
import MobileNumberInput from '../MobileNumberInput';
import React from 'react';
import { IdentifierInputProps } from './types';

const IdentifierInput: React.FC<IdentifierInputProps> = ({
  emailRef,
  countryCode,
  formik,
  handleCountryCodePress,
  handleMobileChange,
  iconColor,
  isEmail,
  mobileRef,
  toggleInputMode,
}) => {
  if (isEmail) {
    return (
      <>
        <Input
          ref={emailRef}
          placeholder="Email"
          LeftAccessory={() => (
            <Ionicons
              name="mail"
              size={26}
              color={iconColor}
              style={{ alignSelf: 'center', marginStart: 6, opacity: 1 }}
            />
          )}
          value={formik.values.identifier}
          onChangeText={formik.handleChange('identifier')}
          onBlur={formik.handleBlur('identifier')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={
            formik.touched.identifier ? formik.errors.identifier : undefined
          }
        />
        <Button
          variant="secondary"
          onPress={toggleInputMode}
          title="Continue with mobile"
          size="large"
        />
      </>
    );
  } else {
    return (
      <>
        <MobileNumberInput
          ref={mobileRef}
          value={formik.values.identifier}
          countryCode={countryCode}
          onCountryCodePress={handleCountryCodePress}
          onChangeText={handleMobileChange}
          onBlur={formik.handleBlur('identifier')}
          error={
            formik.touched.identifier ? formik.errors.identifier : undefined
          }
        />
        <Button
          variant="secondary"
          onPress={toggleInputMode}
          title="Continue with email"
          size="large"
        />
      </>
    );
  }
};

export default React.memo(IdentifierInput);
