import { User, Product } from '../types';

export interface AppContextType {
  users: User[];
  products: Product[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshUser: () => Promise<void>; 
}