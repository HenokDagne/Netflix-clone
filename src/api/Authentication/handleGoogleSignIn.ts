import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";

const googleProvider = new GoogleAuthProvider();

const handleGoogleSignIn = async () => {
  try {
    if (!auth) throw new Error("FIREBASE_NOT_CONFIGURED");
    const result = await signInWithPopup(auth, googleProvider);
    return { email: result.user.email ?? "" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("GOOGLE_CANCELLED");
      }
    }
    throw new Error("GOOGLE_SIGNIN_FAILED");
  }
};

export default handleGoogleSignIn;
