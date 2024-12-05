import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const ProfileIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/profile/tabs/posts'); // Redirect to 'posts' as the default tab
  }, []);

  return null; // Render nothing while redirecting
};

export default ProfileIndex;
