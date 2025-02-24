import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/app/components/CustomTabBar';
import { ScrollProvider } from '@/src/context/ScrollContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </ProtectedRoute>
  );
}
