import { auth } from "../../config/firbase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface registrationDetails {
  email: string;
  password: string;
  fullname: string;
  username: string;
}

const signupHandler = async ({
  email,
  password,
  fullname,
  username,
}: registrationDetails) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (fullname || username) {
      await updateProfile(userCredential.user, {
        displayName: fullname || username,
      });
    }

    return { email: userCredential.user.email ?? email };
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code === "auth/email-already-in-use"
    ) {
      throw new Error("EMAIL_EXISTS");
    }
    throw error;
  }
};
export default signupHandler;
