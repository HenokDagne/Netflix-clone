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
    <div className="min-h-screen bg-[hsl(240,23%,11%)] flex items-center justify-center px-4">
      {/* Undo button (top-left) */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        title="Undo / Go back"
        className="fixed left-4 top-4 z-50 bg-transparent hover:bg-slate-700 text-slate-100 px-3 py-2  flex items-center gap-2"
      >
        <span aria-hidden className="text-sm">
          ←
        </span>
      </button>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left poster */}
        <div className="hidden md:block rounded-l-xl overflow-hidden bg-slate-800">
          <img
            src={new URL("../../../assets/movies.webp", import.meta.url).href}
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = new URL(
                "../../../assets/movies.webp",
                import.meta.url,
              ).href;
            }}
            alt="Avenger Poster"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right card */}
        <div className="bg-[#1f1f2d] backdrop-blur rounded-xl md:rounded-r-xl md:rounded-l-none shadow-2xl p-8 md:p-10 text-slate-100">
          <h2 className="text-3xl font-semibold">Welcome back,</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Placeholder"
                className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="Placeholder"
                className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {status && (
              <p
                className={
                  status.kind === "error"
                    ? "text-red-400 text-sm"
                    : "text-green-400 text-sm"
                }
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-300">
            <span>Don’t have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-red-400 hover:text-red-300"
            >
              Sign up
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="text-white hover:text-slate-200 disabled:opacity-50 flex items-center gap-2 bg-black px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            >
              <img
                src={
                  new URL("../../../assets/chrome.png", import.meta.url).href
                }
                onError={(e) => {
                  const t = e.currentTarget;
                  t.onerror = null;
                  t.src = new URL(
                    "../../../assets/chrom.png",
                    import.meta.url,
                  ).href;
                }}
                alt="Chrome icon"
                className="h-5 w-5 object-contain rounded-full"
                loading="lazy"
              />
              {googleLoading
                ? "Signing in with Google..."
                : "Sign in with Google"}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => navigate("/phoneOtp")}
              className="fonte-bold text-slate-300 hover:text-slate-100 flex items-center gap-2 bg-blue-900 hover:bg-slate-800/60 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M22 16.92V21a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 013 4.18 2 2 0 015 2h4.09a2 2 0 012 1.72c.12 1.06.37 2.09.73 3.05a2 2 0 01-.45 2.11L10.2 11.8a16 16 0 006 6l1.89-1.17a2 2 0 012.11-.45c.96.36 1.99.61 3.05.73A2 2 0 0122 16.92z" />
              </svg>
              Sign in with phone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
