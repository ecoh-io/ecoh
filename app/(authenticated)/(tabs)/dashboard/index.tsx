import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';

const DashboardScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Home Details Screen</Text>
      <Link href={'/(authenticated)/(tabs)/dashboard/details'}>
        <Button title="Go to Details" />
      </Link>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
};

export default DashboardScreen;
