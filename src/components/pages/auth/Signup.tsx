import { useState, type FormEvent, type ChangeEvent } from "react";
import validator from "validator"; // npm: validator [web:9]
import { useNavigate } from "react-router-dom";

import signupHandler from "../../../api/Authentication/signupHandler";

type Errors = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  fullname?: string;
};

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{
    message: string;
    kind: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const validateField = (
    name: keyof Errors,
    value: string,
    form: {
      email: string;
      password: string;
      confirmPassword: string;
      fullname: string;
      username: string;
    },
  ) => {
    let message: string | undefined;

    if (name === "fullname") {
      if (!value.trim()) {
        message = "Full name is required.";
      }
    }

    if (name === "username") {
      if (!value.trim() || value.trim().length < 3) {
        message = "Username must be at least 3 characters.";
      }
    }

    if (name === "email") {
      if (!value.trim() || !validator.isEmail(value)) {
        message = "Enter a valid email address.";
      }
    }

    if (name === "password") {
      if (!value || value.length < 8) {
        message = "Password must be at least 8 characters.";
      } else if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        message = "Password must contain an uppercase letter and a number.";
      }
      // also revalidate confirmPassword when password changes
      if (form.confirmPassword) {
        if (form.confirmPassword !== value) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords must match.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: undefined,
          }));
        }
      }
    }

    if (name === "confirmPassword") {
      if (!value || value !== form.password) {
        message = "Passwords must match.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const validateForm = () => {
    const formState = { email, password, confirmPassword, fullname, username };
    const nextErrors: Errors = {};

    if (!formState.fullname.trim()) {
      nextErrors.fullname = "Full name is required.";
    }

    if (!formState.username.trim() || formState.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!formState.email.trim() || !validator.isEmail(formState.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formState.password || formState.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    } else if (
      !/[A-Z]/.test(formState.password) ||
      !/[0-9]/.test(formState.password)
    ) {
      nextErrors.password =
        "Password must contain an uppercase letter and a number.";
    }

    if (
      !formState.confirmPassword ||
      formState.password !== formState.confirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const result = await signupHandler({
        email,
        password,
        fullname,
        username,
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullname("");
      setUsername("");
      setStatus({
        message: `${result?.email ?? email} signup successful`,
        kind: "success",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);
      if (error instanceof Error && error.message === "EMAIL_EXISTS") {
        setStatus({
          message: `${email} is already registered. Redirecting to login...`,
          kind: "error",
        });
        navigate("/login", { replace: true });
      } else {
        setStatus({
          message: "Signup failed. Please try again.",
          kind: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (name: keyof Errors) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (name === "fullname") setFullname(value);
      if (name === "email") setEmail(value);
      if (name === "username") setUsername(value);
      if (name === "password") setPassword(value);
      if (name === "confirmPassword") setConfirmPassword(value);

      const formState = {
        email: name === "email" ? value : email,
        password: name === "password" ? value : password,
        confirmPassword: name === "confirmPassword" ? value : confirmPassword,
        fullname: name === "fullname" ? value : fullname,
        username: name === "username" ? value : username,
      };

      // dynamic validation onChange
      validateField(name, value, formState);
    };

  return (
    <div className="min-h-screen bg-[hsl(240,23%,11%)] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 text-slate-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Create Account</h1>
          <p className="text-sm text-slate-400">
            Sign up to get started with us
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={fullname}
              onChange={handleChange("fullname")}
              disabled={loading}
            />
            {errors.fullname && (
              <p className="text-red-400 text-xs">{errors.fullname}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={email}
              onChange={handleChange("email")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={username}
              onChange={handleChange("username")}
              disabled={loading}
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={password}
              onChange={handleChange("password")}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={confirmPassword}
              onChange={handleChange("confirmPassword")}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          {status && (
            <p
              className={
                status.kind === "success"
                  ? "text-green-400 text-sm"
                  : "text-red-400 text-sm"
              }
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-300">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
