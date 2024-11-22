import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/app/components/CustomTabBar';
import { ScrollProvider } from '@/src/context/ScrollContext';

export default function TabsLayout() {
  return (
    <ScrollProvider>
      <Tabs
        initialRouteName="feed"
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
    </ScrollProvider>
  );
}
