import { signOut } from "firebase/auth";
import { auth } from "../../config/firbase";

const logoutHandler = async () => {
  await signOut(auth);
};

export default logoutHandler;
