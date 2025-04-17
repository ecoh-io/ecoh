import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { SecureUrlTextProps } from './types';

const SecureUrlText: React.FC<SecureUrlTextProps> = ({ url, isSecure }) => {
  return (
    <Text style={styles.urlText}>
      <Ionicons
        name={isSecure ? 'lock-closed' : 'lock-open'}
        size={16}
        color={isSecure ? '#8BC34A' : '#FF9800'}
      />{' '}
      {url}
    </Text>
  );
};

export default SecureUrlText;
