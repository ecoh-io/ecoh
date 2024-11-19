import React, { createContext, useContext, useState } from 'react';
import { lightColors, darkColors } from './colors';

type Colors = typeof lightColors;

interface ThemeContextProps {
  colors: Colors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  colors: lightColors,
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
