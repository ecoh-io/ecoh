import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const ProfileIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(authenticated)/(tabs)/profile/posts'); // Redirect to 'posts' as the default tab
  }, []);

  return null; // Render nothing while redirecting
};

export default ProfileIndex;
