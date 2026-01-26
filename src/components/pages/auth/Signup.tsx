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
    <div className="flex">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

        <input
          type="text"
          placeholder="Full name"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={fullname}
          onChange={handleChange("fullname")}
        />
        {errors.fullname && (
          <p className="text-red-500 text-sm mb-2">{errors.fullname}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={email}
          onChange={handleChange("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={username}
          onChange={handleChange("username")}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={password}
          onChange={handleChange("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={confirmPassword}
          onChange={handleChange("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        {status && (
          <p
            className={
              status.kind === "success"
                ? "text-green-600 text-sm mb-2"
                : "text-red-500 text-sm mb-2"
            }
          >
            {status.message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
