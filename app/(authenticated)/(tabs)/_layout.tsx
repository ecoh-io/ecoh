import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/app/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
