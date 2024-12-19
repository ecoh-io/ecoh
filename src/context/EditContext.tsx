import { createContext, useCallback, useContext, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { User } from '../interfaces/user';
import { Gender } from '../enums/gender.enum';
import { useUpdateUser } from '../hooks/useUpdateUserProfile';
import { Location } from '../types/location';

interface EditContextType {
  user: User | null;
  isLoading: boolean;
  updateName: (name: string) => void;
  updateUsername: (username: string) => void;
  updateBio: (bio: string) => void;
  updateLinks: (links: Record<string, string> | null) => void;
  updateGender: (gender: Gender) => void;
  updateLocation: (
    location: Location | null,
    city: string | null,
    region: string | null,
  ) => void;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authUser = useAuthStore((state) => state.user);
  const [user, setUser] = useState<User | null>(authUser);
  const { mutateAsync: updateUserProfile, isPending } = useUpdateUser(
    user?.id || '',
  );
  const updateUserProfileInStore = useAuthStore(
    (state) => state.updateUserProfile,
  );

  console.log('Edit context user:', user);

  const updateName = useCallback(
    async (name: string) => {
      if (user) {
        const updatedUser = { ...user, name };
        await updateUserProfile({ name });
        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const updateUsername = useCallback(
    async (username: string) => {
      if (user) {
        const updatedUser = { ...user, username };
        await updateUserProfile({ username });
        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const updateBio = useCallback(
    async (bio: string) => {
      if (user) {
        const updatedUser = { ...user, profile: { ...user.profile, bio } };
        try {
          await updateUserProfile({ bio });
        } catch (error) {
          console.error('Failed to update bio:', error);
        }

        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const updateLinks = useCallback(
    async (links: Record<string, string> | null) => {
      if (user) {
        const updatedUser = {
          ...user,
          profile: { ...user.profile, socialLinks: links || null },
        };
        await updateUserProfile({ links: links || null });
        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const updateGender = useCallback(
    async (gender: Gender) => {
      if (user) {
        const updatedUser = { ...user, profile: { ...user.profile, gender } };
        await updateUserProfile({ gender });
        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const updateLocation = useCallback(
    async (
      location: Location | null,
      city: string | null,
      region: string | null,
    ) => {
      if (user) {
        const updatedUser = {
          ...user,
          profile: { ...user.profile, location, city, region },
        };
        await updateUserProfile({
          location: location || null,
          city: city || null,
          region: region || null,
        });
        setUser(updatedUser);
        updateUserProfileInStore(updatedUser);
      }
    },
    [user, updateUserProfile, updateUserProfileInStore],
  );

  const value = {
    user,
    isLoading: isPending,
    updateName,
    updateUsername,
    updateBio,
    updateLinks,
    updateGender,
    updateLocation,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
