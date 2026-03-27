import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

const logoutHandler = async () => {
  if (!auth) return;
  await signOut(auth);
};

export default logoutHandler;
