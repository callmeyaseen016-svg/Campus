import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  domainError: string | null;
  signInWithGoogle: () => Promise<AuthUser | null>;
  signOutUser: () => Promise<void>;
  clearDomainError: () => void;
  bypassDomainCheck: boolean;
  setBypassDomainCheck: (val: boolean) => void;
  signInAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: AuthUser = {
  uid: 'demo-student-vit-2026',
  email: 'rahul.s2023@vitstudent.ac.in',
  displayName: 'Rahul Sharma',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  firstName: 'Rahul',
  isVitStudent: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [bypassDomainCheck, setBypassDomainCheck] = useState<boolean>(false);

  // Helper to extract first name
  const parseFirstName = (displayName: string | null, email: string | null): string => {
    if (displayName) {
      const parts = displayName.trim().split(' ');
      return parts[0];
    }
    if (email) {
      const handle = email.split('@')[0];
      const clean = handle.replace(/[0-9_.]/g, ' ');
      const namePart = clean.trim().split(' ')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'Student';
  };

  useEffect(() => {
    // Check if demo user session saved
    const savedDemo = localStorage.getItem('campus_cart_demo_user');
    if (savedDemo) {
      setUser(JSON.parse(savedDemo));
      setLoading(false);
      return;
    }

    if (auth && isFirebaseConfigured()) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          const email = firebaseUser.email || '';
          const isVit = email.toLowerCase().endsWith('@vitstudent.ac.in');

          if (!isVit && !bypassDomainCheck) {
            // Sign out immediately as per requirement
            await firebaseSignOut(auth);
            setUser(null);
            setDomainError(email || 'your email');
          } else {
            setDomainError(null);
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
              firstName: parseFirstName(firebaseUser.displayName, firebaseUser.email),
              isVitStudent: true
            };
            setUser(authUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [bypassDomainCheck]);

  const signInWithGoogle = async (): Promise<AuthUser | null> => {
    setDomainError(null);
    if (auth && googleProvider && isFirebaseConfigured()) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const email = firebaseUser.email || '';
        const isVit = email.toLowerCase().endsWith('@vitstudent.ac.in');

        if (!isVit && !bypassDomainCheck) {
          await firebaseSignOut(auth);
          setUser(null);
          setDomainError(email || 'your email');
          return null;
        }

        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
          firstName: parseFirstName(firebaseUser.displayName, firebaseUser.email),
          isVitStudent: true
        };
        setUser(authUser);
        return authUser;
      } catch (error: any) {
        console.error('Google Auth Error:', error);
        // If popup blocked or cancelled, allow quick demo fallback for seamless testing
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          console.warn('User closed auth popup.');
        }
        throw error;
      }
    } else {
      // Fallback for demo when Firebase config is missing or in offline mode
      signInAsDemoUser();
      return DEMO_USER;
    }
  };

  const signInAsDemoUser = () => {
    setDomainError(null);
    localStorage.setItem('campus_cart_demo_user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  };

  const signOutUser = async () => {
    localStorage.removeItem('campus_cart_demo_user');
    if (auth && isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    setUser(null);
  };

  const clearDomainError = () => {
    setDomainError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        domainError,
        signInWithGoogle,
        signOutUser,
        clearDomainError,
        bypassDomainCheck,
        setBypassDomainCheck,
        signInAsDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
