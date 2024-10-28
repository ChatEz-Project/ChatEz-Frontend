import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

// Type for the authentication context
interface AuthContextType {
  currentUser: User | null;
  currentUserAccessToken: string | null;
  userLoggedIn: boolean;
  loading: boolean;
}

// Props type for AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component to provide authentication context to its children
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserAccessToken, setCurrentUserAccessToken] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  // Function to initialize user state based on Firebase auth state
  async function initializeUser(user: User | null): Promise<void> {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
      const accessToken = await user.getIdToken();
      setCurrentUserAccessToken(accessToken);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  // Value to be provided by the AuthContext
  const value: AuthContextType = {
    currentUser,
    currentUserAccessToken,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
