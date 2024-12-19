import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../interfaces/user';

const USER_DATA_KEY = 'user_data';

// Save user data to AsyncStorage
export const saveUserData = async (userData: User): Promise<void> => {
  try {
    const serializedData = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, serializedData);
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

// Load user data from AsyncStorage
export const loadUserData = async (): Promise<User | null> => {
  try {
    const serializedData = await AsyncStorage.getItem(USER_DATA_KEY);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error('Failed to load user data:', error);
    return null;
  }
};

// Remove user data from AsyncStorage
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

// Check if user data is present in AsyncStorage
export const isUserDataAvailable = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data !== null;
  } catch (error) {
    console.error('Failed to check user data availability:', error);
    return false;
  }
};
