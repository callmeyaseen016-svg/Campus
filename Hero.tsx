import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  Auth, 
  User 
} from 'firebase/auth';
import { Listing, AuthUser } from '../types';
import { DEFAULT_LISTINGS } from '../data/defaultListings';

// Default Firebase configuration provided by user
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD9M4iAUdsm_x9o_8CyaxPe3f16wzNQ-0o",
  authDomain: "marketplace-cb06e.firebaseapp.com",
  projectId: "marketplace-cb06e",
  storageBucket: "marketplace-cb06e.firebasestorage.app",
  messagingSenderId: "817625626559",
  appId: "1:817625626559:web:ab560af75e08be5f97130a",
  measurementId: "G-5BTBJZ4WYK"
};

// Check for stored custom firebase config or environment variables
const getStoredConfig = () => {
  try {
    const custom = localStorage.getItem('campus_cart_firebase_config');
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.warn('Failed to parse custom firebase config:', e);
  }

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (apiKey) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

const config = getStoredConfig();

if (config && config.apiKey && config.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.error('Error initializing Firebase with provided config:', err);
  }
}

export { db, auth, googleProvider };

// Save custom config dynamically at runtime
export const saveCustomFirebaseConfig = (cfg: any) => {
  try {
    localStorage.setItem('campus_cart_firebase_config', JSON.stringify(cfg));
    window.location.reload();
  } catch (e) {
    console.error('Failed to save firebase config:', e);
  }
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem('campus_cart_firebase_config');
  window.location.reload();
};

export const isFirebaseConfigured = () => {
  return db !== null && auth !== null;
};

// Test firestore connection as requested by firebase skill guidelines
export const testFirestoreConnection = async () => {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'listings', 'test_connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firestore offline:', error.message);
    }
    return false;
  }
};

// Helper enum and error handler matching skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Subscribe to real-time listings from Firestore or local fallback
export const subscribeToListings = (
  callback: (listings: Listing[]) => void,
  onError?: (err: any) => void
) => {
  if (db) {
    try {
      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const fetched: Listing[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetched.push({
              id: docSnap.id,
              name: data.name || 'Untitled Item',
              category: data.category || 'Other',
              price: Number(data.price) || 0,
              condition: data.condition || 'Good',
              description: data.description || '',
              imageBase64: data.imageBase64 || undefined,
              createdAt: data.createdAt || Date.now(),
              sellerId: data.sellerId || 'anonymous',
              sellerName: data.sellerName || 'Campus Seller',
              sellerPhoto: data.sellerPhoto || undefined,
              sellerContact: data.sellerContact || undefined,
            });
          });

          if (fetched.length === 0) {
            // Seed defaults into local view if Firestore is empty
            callback(DEFAULT_LISTINGS);
          } else {
            callback(fetched);
          }
        },
        (error) => {
          console.warn('Firestore listener fallback to local:', error);
          if (onError) onError(error);
          // Fallback to local storage if permission denied or offline
          const local = getLocalListings();
          callback(local);
        }
      );
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      const local = getLocalListings();
      callback(local);
      return () => {};
    }
  } else {
    // Local fallback listener with window events for multi-tab sync in local mode
    const notify = () => {
      callback(getLocalListings());
    };
    notify();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'campus_cart_listings_v1') {
        notify();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('local_listings_updated', notify);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local_listings_updated', notify);
    };
  }
};

// Local storage management for fallback when Firebase is not yet connected
const getLocalListings = (): Listing[] => {
  try {
    const stored = localStorage.getItem('campus_cart_listings_v1');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse local listings:', e);
  }
  return DEFAULT_LISTINGS;
};

const saveLocalListings = (listings: Listing[]) => {
  try {
    localStorage.setItem('campus_cart_listings_v1', JSON.stringify(listings));
    window.dispatchEvent(new Event('local_listings_updated'));
  } catch (e) {
    console.error('Failed to save local listings:', e);
  }
};

// Add new listing to Firestore or local state
export const addListingToStore = async (
  listingData: Omit<Listing, 'id'>
): Promise<string> => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...listingData,
        createdAt: listingData.createdAt || Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'listings');
      throw error;
    }
  } else {
    const current = getLocalListings();
    const newListing: Listing = {
      ...listingData,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    const updated = [newListing, ...current];
    saveLocalListings(updated);
    return newListing.id;
  }
};

// Delete a listing from Firestore or local state
export const deleteListingFromStore = async (listingId: string): Promise<void> => {
  if (db && !listingId.startsWith('local-') && !listingId.startsWith('listing-')) {
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `listings/${listingId}`);
      throw error;
    }
  } else {
    const current = getLocalListings();
    const updated = current.filter((item) => item.id !== listingId);
    saveLocalListings(updated);
  }
};
