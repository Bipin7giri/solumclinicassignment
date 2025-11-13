"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Field } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/components/ui/toast";

type ValidUser = {
  email: string;
  password: string;
  displayName?: string;
};

const VALID_USERS: ValidUser[] = [
  { email: "test@example.com", password: "Password1!" },
  { email: "demo@company.com", password: "Welcome123$" },
  {
    email: "sample.user@domain.org",
    password: "SamplePass9@",
    displayName: "Sample User",
  },
];

const STORAGE_KEY = "loginState";

const passwordRequirements = [
  "8-16 characters",
  "1 uppercase letter",
  "1 lowercase letter",
  "1 number",
  "1 symbol",
];

type StoredLoginState = {
  email?: string;
  isAuthenticated?: boolean;
};

const passwordMeetsCriteria = (value: string) => {
  const lengthOk = value.length >= 8 && value.length <= 16;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  return lengthOk && hasUppercase && hasLowercase && hasNumber && hasSymbol;
};

export const LoginForm = () => {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const passwordRequirementsText = useMemo(
    () => passwordRequirements.join(" • "),
    []
  );

  const resetErrors = useCallback(() => {
    setEmailError("");
    setPasswordError("");
    setAuthError("");
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasHydrated(true);
        return;
      }
      const stored = JSON.parse(raw) as StoredLoginState;
      if (stored.isAuthenticated && stored.email) {
        setIsAuthenticated(true);
        setEmail(stored.email);
      }
    } catch (error) {
      console.error("Failed to restore login state:", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();

    const trimmedEmail = email.trim();
    let matchedUser: ValidUser | undefined;

    let nextEmailError = "";
    let nextPasswordError = "";

    if (!trimmedEmail) {
      nextEmailError = "Please enter your email address.";
    } else {
      matchedUser = VALID_USERS.find(
        (validUser) =>
          validUser.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (!matchedUser) {
        nextEmailError = "We could not find an account with that email.";
      }
    }

    if (!passwordMeetsCriteria(password)) {
      nextPasswordError =
        "Password must meet the listed requirements before you can continue.";
    }

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      if (nextEmailError) {
        showToast({ message: nextEmailError, variant: "error" });
      } else if (nextPasswordError) {
        showToast({ message: nextPasswordError, variant: "error" });
      }
      return;
    }

    if (matchedUser && matchedUser.password !== password) {
      const incorrectPasswordMessage = "Incorrect password. Please try again.";
      setAuthError(incorrectPasswordMessage);
      showToast({ message: incorrectPasswordMessage, variant: "error" });
      return;
    }

    setIsAuthenticated(true);
    if (matchedUser) {
      setEmail(matchedUser.email);
      setPassword("");
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ email: matchedUser.email, isAuthenticated: true })
      );
      const successMessage = `Welcome back${
        matchedUser.displayName ? `, ${matchedUser.displayName}` : ""
      }!`;
      showToast({ message: successMessage, variant: "success" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    resetErrors();
    sessionStorage.removeItem(STORAGE_KEY);
    showToast({ message: "You have been logged out.", variant: "info" });
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
      {!hasHydrated ? (
        <div className="space-y-4 text-center text-sm text-white/70">
          <p>Loading session…</p>
        </div>
      ) : isAuthenticated ? (
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome!</h1>
            <p className="text-balance text-sm text-white/80">
              Welcome, <span className="font-medium">{email}</span>
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <>
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-white/70">
              Enter the credentials provided to you to continue.
            </p>
          </header>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <Field id="email" label="Email address" error={emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field
                id="password"
                label="Password"
                error={passwordError}
                description={passwordRequirementsText}
              >
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </Field>
            </div>

            {authError && (
              <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-200">
                {authError}
              </p>
            )}

            <Button type="submit">Log in</Button>

            <div className="text-center text-sm">
              <a
                href="#"
                className="font-medium text-indigo-300 underline-offset-4 transition hover:text-indigo-200 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
