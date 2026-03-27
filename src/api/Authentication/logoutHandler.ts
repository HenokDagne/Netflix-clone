import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

const logoutHandler = async () => {
  await signOut(auth);
};

export default logoutHandler;
