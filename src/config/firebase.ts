import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env
    .VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const isConfigComplete = (cfg: typeof firebaseConfig) =>
  !!(
    cfg.apiKey &&
    cfg.authDomain &&
    cfg.projectId &&
    cfg.storageBucket &&
    cfg.messagingSenderId &&
    cfg.appId
  );

let app: FirebaseApp | null = null;

try {
  if (isConfigComplete(firebaseConfig)) {
    app = initializeApp(firebaseConfig);
  } else {
    app = null;
  }
} catch {
  // If env vars are missing/invalid, we still want the bundle to build.
  // Firebase will throw at runtime; callers should handle auth failures.
  app = null;
}

export const auth: Auth | null = app ? getAuth(app) : null;


