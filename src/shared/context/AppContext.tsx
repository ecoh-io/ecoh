import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../theme/colors';

// 1. Update the interface to reflect that toggleTheme returns a Promise<void>
interface AppContextProps {
  theme: typeof lightColors;
  themeType: 'light' | 'dark';
  toggleTheme: () => Promise<void>;
}

// 2. Define the props for AppProvider to include children
interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [themeType, setThemeType] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeType(savedTheme);
        } else {
          // Optional: Set to light if savedTheme is invalid
          setThemeType('light');
        }
      } catch (e) {
        console.error('Failed to load theme:', e);
        // Optional: Set to light in case of error
        setThemeType('light');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  const theme = themeType === 'light' ? lightColors : darkColors;

  return (
    <AppContext.Provider value={{ theme, themeType, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </AppContext.Provider>
  );
};

// 3. Update the hook to reflect the correct return type
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
