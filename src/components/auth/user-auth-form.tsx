"use client";

import { HTMLAttributes, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
});

// Email validation regex (from SignIn.tsx)
const EMAIL_REGEX = /^[a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;

// Password strength validation (from SignIn/SignUp.tsx)
const hasLowerCase = (str: string) => /[a-z]/.test(str);
const hasUpperCase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);
const hasSpecialChar = (str: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
const isLongEnough = (str: string) => str.length >= 8; // Adjusted minimum length based on SignUp.tsx

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); // Use null initial state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    isLongEnough: false,
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      setIsEmailValid(EMAIL_REGEX.test(newEmail));
    } else {
      setIsEmailValid(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      const hasLower = hasLowerCase(newPassword);
      const hasUpper = hasUpperCase(newPassword);
      const hasNum = hasNumber(newPassword);
      const hasSpecial = hasSpecialChar(newPassword);
      const isLong = isLongEnough(newPassword);

      let score = 0;
      if (hasLower) score++;
      if (hasUpper) score++;
      if (hasNum) score++;
      if (hasSpecial) score++;
      if (isLong) score++;

      setPasswordStrength({
        score,
        hasLower,
        hasUpper,
        hasNumber: hasNum,
        hasSpecial,
        isLongEnough: isLong,
      });
    } else {
      setPasswordStrength({
        score: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
        isLongEnough: false,
      });
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmailValid && passwordStrength.score >= 4) { // Check score >= 4 for minimum strength
      setIsLoading(true);
      setErrorMessage("");
      try {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          let message = "An error occurred during sign in";
          if (error.message.includes("Invalid login credentials")) {
            message = "Invalid email or password";
          } else if (error.message.includes("Email not confirmed")) {
            message = "Please confirm your email address";
          }
          setErrorMessage(message);
        } else if (signInData.user) {
          toast({
            title: "Success",
            description: "You have successfully signed in",
          });
          window.location.reload(); // Reload after successful sign in
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        setErrorMessage("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      if (provider === "google") setIsGoogleLoading(true);
      if (provider === "github") setIsGithubLoading(true);
      setErrorMessage(""); // Clear previous errors

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        console.error(`OAuth error:`, error);
        setErrorMessage(`Failed to sign in with ${provider}. Please try again.`);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(`Failed to initiate ${provider} sign in.`);
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setErrorMessage(`An unexpected error occurred while signing in with ${provider}`);
    } finally {
      // Keep loading indicator until redirect or error
      // No need to set loading to false here as page will redirect
      // If error, it will be set below (or kept if needed)
      if (provider === "google" && errorMessage) setIsGoogleLoading(false);
      if (provider === "github" && errorMessage) setIsGithubLoading(false);
    }
  };

  // Style helper functions from SignIn/SignUp
  const getEmailBorderClass = () => {
    if (isEmailValid === null) return "border-gray-300 dark:border-gray-700";
    return isEmailValid
      ? "border-green-500 ring-1 ring-green-500"
      : "border-red-500 ring-1 ring-red-500";
  };

  const getPasswordBorderClass = () => {
    if (!password) return "border-gray-300 dark:border-gray-700";
    return passwordStrength.score >= 4 // Using score 4 as threshold for valid password display
      ? "border-green-500 ring-1 ring-green-500"
      : "border-red-500 ring-1 ring-red-500";
  };

  const isPasswordLoginDisabled = () => {
    return !isEmailValid || passwordStrength.score < 4 || isLoading;
  };

  return (
    <div className={cn("space-y-4 bg-transparent", className)} {...props}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-left">Welcome back</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-left mb-4">
        Sign in to your account to continue
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className={cn(
              "w-full h-[42px] px-3 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none",
              getEmailBorderClass()
            )}
            placeholder="Email address"
            autoComplete="username"
          />
        </div>

        <div className="relative">
          <input
            id="password"
            type="password" // Keep type as password
            value={password}
            onChange={handlePasswordChange}
            required
            className={cn(
              "w-full h-[42px] px-3 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none",
              getPasswordBorderClass()
            )}
            placeholder="Password"
            autoComplete="current-password"
          />
          <Link
            href="https://lomi.africa/forgot-password" // Updated href
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Security best practice
            className="absolute right-2 top-[14px] text-xs text-blue-600 dark:text-blue-400 hover:underline bg-transparent"
          >
            Forgot password?
          </Link>
        </div>

        {/* Optional: Password strength indicator from SignUp */}
        {password && passwordStrength.score < 5 && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index <= passwordStrength.score ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${passwordStrength.isLongEnough ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>8+ chars</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${passwordStrength.hasLower ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>abc</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${passwordStrength.hasUpper ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>ABC</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${passwordStrength.hasNumber ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>123</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${passwordStrength.hasSpecial ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>!@#</span>
            </div>
          </div>
        )}

        {errorMessage && (
          // Use the style from the original component for consistency
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg border border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPasswordLoginDisabled()}
          className="w-full h-[42px] px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Spinner className="w-4 h-4 mx-auto" /> : 'Sign in'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-background text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Google Button - styled like SignIn/SignUp */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isGoogleLoading || isGithubLoading}
          className="w-full h-[42px] px-3 rounded-md bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-white border border-gray-300 dark:border-gray-700 text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" className="dark:fill-white" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" className="dark:fill-white" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" className="dark:fill-white" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" className="dark:fill-white" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* GitHub Button - styled like SignIn/SignUp */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isGoogleLoading || isGithubLoading}
          className="w-full h-[42px] px-3 rounded-md bg-[#333] hover:bg-[#444] dark:bg-[#171515] dark:hover:bg-[#2b2a2a] text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGithubLoading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          <span>Continue with GitHub</span>
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="https://lomi.africa/sign-up" // Updated href
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Security best practice
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
