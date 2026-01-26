import { auth } from "../../config/firbase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

interface authCredentials {
  email: string;
  password: string;
}

const signInWithCredentials = async ({ email, password }: authCredentials) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      const invalidCodes = new Set([
        "auth/wrong-password",
        "auth/user-not-found",
        "auth/invalid-credential",
        "auth/invalid-email",
        "auth/user-disabled",
      ]);

      if (invalidCodes.has(error.code)) {
        throw new Error("INVALID_CREDENTIALS");
      }

      throw new Error("LOGIN_FAILED");
    }
    throw error;
  }
};
export default signInWithCredentials;
