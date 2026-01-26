import {
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../config/firbase";

let cachedVerifier: RecaptchaVerifier | null = null;
let pendingConfirmation: ConfirmationResult | null = null;

const clearState = () => {
  if (cachedVerifier) {
    cachedVerifier.clear();
  }
  cachedVerifier = null;
  pendingConfirmation = null;
};

const ensureRecaptcha = (containerId = "recaptcha-container") => {
  if (!cachedVerifier) {
    cachedVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return cachedVerifier;
};

export const sendPhoneCode = async (
  phoneNumber: string,
  containerId?: string,
) => {
  try {
    const verifier = ensureRecaptcha(containerId);
    pendingConfirmation = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier,
    );
    return { verificationId: pendingConfirmation.verificationId };
  } catch (error: unknown) {
    clearState();
    if (error instanceof Error && (error as any).code) {
      const code = (error as any).code as string;
      if (code === "auth/billing-not-enabled")
        throw new Error("PHONE_BILLING_REQUIRED");
      if (code === "auth/quota-exceeded")
        throw new Error("PHONE_QUOTA_EXCEEDED");
      if (code === "auth/too-many-requests")
        throw new Error("PHONE_RATE_LIMITED");
      if (code === "auth/invalid-phone-number")
        throw new Error("PHONE_INVALID");
      if (
        code === "auth/missing-recaptcha-token" ||
        code === "auth/invalid-app-credential"
      ) {
        throw new Error("PHONE_RECAPTCHA_FAILED");
      }
    }
    throw error;
  }
};

export const confirmPhoneCode = async (code: string) => {
  if (!pendingConfirmation) {
    throw new Error("NO_PENDING_CONFIRMATION");
  }

  const cred = await pendingConfirmation.confirm(code);
  pendingConfirmation = null;
  return { phoneNumber: cred.user.phoneNumber ?? "" };
};

export const resetPhoneRecaptcha = clearState;

export default {
  sendPhoneCode,
  confirmPhoneCode,
  resetPhoneRecaptcha,
};
