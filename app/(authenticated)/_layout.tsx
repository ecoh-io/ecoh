// app/(authenticated)/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function Layout() {
  return (
    <ProtectedRoute>
      <Slot />
    </ProtectedRoute>
  );
}
