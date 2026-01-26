import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom"; // Or your navigation method
import auth from "../../../api/Authentication/auth";
import handleGoogleSignIn from "../../../api/Authentication/handleGoogleSignIn";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [status, setStatus] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await auth({ email, password });

      // Clear fields immediately on success
      setEmail("");
      setPassword("");
      setStatus(null);

      // Navigate or redirect
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        setStatus({
          kind: "error",
          message: "The email or password is incorrect.",
        });
      } else {
        setStatus({
          kind: "error",
          message: "We couldn't sign you in. Please try again.",
        });
      }
      // Don't clear on error - user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setStatus(null);
    setGoogleLoading(true);
    try {
      const res = await handleGoogleSignIn();
      setStatus({
        kind: "success",
        message: `${res.email || "Account"} signed in with Google.`,
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      if (error instanceof Error && error.message === "GOOGLE_CANCELLED") {
        setStatus({ kind: "error", message: "Google sign-in was cancelled." });
      } else {
        setStatus({ kind: "error", message: "Could not sign in with Google." });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      
        <img
          src={new URL("../../../assets/avanger.jpg", import.meta.url).href} // updated image source
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = new URL("../../../assets/avanger.jpg", import.meta.url).href; // updated image source
          }}
          alt="Avanger"
          className="h-32 w-32 object-cover"
          loading="lazy"
        />
      
      <div className="flex flex-col">
      <form className="flex flex-col w-64" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="ml-4 flex flex-col self-center gap-2">
        <button onClick={() => navigate("/signup")} className="text-blue-500">
          Create Account
        </button>
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="text-red-500 disabled:opacity-50"
        >
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </button>
        <button
          onClick={() => navigate("/phoneOtp")}
          className="text-purple-500"
        >
          Sign in with phone
        </button>
        </div>
      </div>

      {status && (
        <p
          className={
            status.kind === "error"
              ? "text-red-500 text-sm mt-2"
              : "text-green-600 text-sm mt-2"
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}

export default Login;
