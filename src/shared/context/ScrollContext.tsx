import React, { createContext, useState, ReactNode } from 'react';

interface ScrollContextProps {
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

export const ScrollContext = createContext<ScrollContextProps>({
  isTabBarVisible: true,
  setTabBarVisible: () => {},
});

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const [isTabBarVisible, setTabBarVisible] = useState(true);

  return (
    <ScrollContext.Provider value={{ isTabBarVisible, setTabBarVisible }}>
      {children}
    </ScrollContext.Provider>
  );
};
