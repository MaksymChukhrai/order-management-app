import { useContext } from 'react';
import { AppContext } from './AppContext';
import { AppContextType } from './AppContextTypes';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
