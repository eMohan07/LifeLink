import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check for missing keys and log clear console error if any are missing
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingKeys = requiredKeys.filter((k) => !import.meta.env[k]);
if (missingKeys.length > 0) {
  console.error(
    `❌ [Firebase Client] Missing required Firebase configuration keys: ${missingKeys.join(', ')}.\n` +
    `Please configure VITE_FIREBASE_* keys in client/.env (see client/.env.example).`
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Triggers Google Sign-in Popup and returns the user's ID token.
 * Includes a 60-second safety timeout so the promise never hangs indefinitely.
 */
export const signInWithGooglePopup = async (timeoutMs = 60000) => {
  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase client credentials are not configured. Missing: ${missingKeys.join(', ')}`
    );
  }

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error('Google sign-in popup timed out. Please try again or use redirect.');
      err.code = 'auth/popup-timeout';
      reject(err);
    }, timeoutMs);
  });

  try {
    const popupPromise = signInWithPopup(auth, googleProvider);
    const result = await Promise.race([popupPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      idToken,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Triggers Google Sign-in via full-page redirect (robust fallback when popups are blocked or COOP-isolated)
 */
export const signInWithGoogleRedirect = async () => {
  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase client credentials are not configured. Missing: ${missingKeys.join(', ')}`
    );
  }
  return await signInWithRedirect(auth, googleProvider);
};

/**
 * Checks for a pending redirect result upon page load
 */
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) return null;
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      idToken,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * Sign out of Firebase Auth session
 */
export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    // Non-blocking logout cleanup
  }
};

export { app, auth, googleProvider };
