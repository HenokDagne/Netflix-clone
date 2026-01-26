import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPhoneCode,
  confirmPhoneCode,
  resetPhoneRecaptcha,
} from "../../../api/Authentication/phoneProvider";

export function PhoneSigin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [status, setStatus] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    setStatus(null);
    setLoading(true);
    try {
      await sendPhoneCode(phoneNumber, "recaptcha-container");
      setCodeSent(true);
      setStatus({ kind: "success", message: "Verification code sent." });
    } catch (error) {
      console.error("Send code failed:", error);
      if (error instanceof Error) {
        if (error.message === "PHONE_BILLING_REQUIRED") {
          setStatus({
            kind: "error",
            message:
              "Phone sign-in needs billing enabled or Firebase test numbers.",
          });
        } else if (error.message === "PHONE_QUOTA_EXCEEDED") {
          setStatus({
            kind: "error",
            message: "Daily SMS quota exceeded. Try again later.",
          });
        } else if (error.message === "PHONE_RATE_LIMITED") {
          setStatus({
            kind: "error",
            message: "Too many attempts. Please wait and retry.",
          });
        } else if (error.message === "PHONE_INVALID") {
          setStatus({
            kind: "error",
            message: "Enter a valid phone number with country code.",
          });
        } else if (error.message === "PHONE_RECAPTCHA_FAILED") {
          setStatus({
            kind: "error",
            message: "Captcha failed. Reload the page and try again.",
          });
        } else {
          setStatus({
            kind: "error",
            message: "Could not send code. Check the phone number.",
          });
        }
      }
      resetPhoneRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const res = await confirmPhoneCode(otp);
      setStatus({
        kind: "success",
        message: `${res.phoneNumber || "Phone"} signed in.`,
      });
      setPhoneNumber("");
      setOtp("");
      setCodeSent(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Verify code failed:", error);
      setStatus({ kind: "error", message: "Invalid code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-sm mx-auto gap-3 p-4">
      <h1 className="text-2xl font-bold">Phone OTP Login</h1>
      <input
        type="tel"
        placeholder="Phone (e.g. +15551234567)"
        className="p-2 border border-gray-300 rounded w-full"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !phoneNumber}
          className="bg-gray-700 text-white px-3 py-2 rounded disabled:opacity-50"
        >
          {loading && !codeSent ? "Sending..." : "Send Code"}
        </button>
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || !codeSent || !otp}
          className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50"
        >
          {loading && codeSent ? "Verifying..." : "Verify Code"}
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter code"
        className="p-2 border border-gray-300 rounded w-full"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading || !codeSent}
      />
      <div id="recaptcha-container" className="hidden" />

      {status && (
        <p
          className={
            status.kind === "error"
              ? "text-red-500 text-sm"
              : "text-green-600 text-sm"
          }
        >
          {status.message}
        </p>
      )}

      <button
        type="button"
        className="text-blue-500"
        onClick={() => navigate("/login")}
      >
        Back to login
      </button>
    </div>
  );
}

export default PhoneSigin;
