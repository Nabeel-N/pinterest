"use client";

import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import { useRouter } from "next/navigation";

type AuthPageProps = {
  isSignin: boolean;
};

export default function AuthPage({ isSignin }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAuth(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const endpoint = `${baseUrl}${isSignin ? "/api/signin" : "/api/signup"}`;
    console.log(endpoint);

    const body: Record<string, string> = {
      email,
      password,
      ...(!isSignin && { name }),
    };

    try {
      console.log("handleAuth called", { endpoint, body });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("auth response", response.status, data);

      if (!response.ok) {
        console.log(!response.ok);
        throw new Error(data?.message || `Error: ${response.status}`);
      }

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Authentication successful! token saved");
        router.push("/home");
        return;
      }

      if (!isSignin) {
        console.log("Signup successful, redirecting to signin");
        router.push("/signin");
        return;
      }

      console.log("No token returned");
      setError(
        data?.message || "Authentication succeeded but no token received"
      );
    } catch (err: any) {
      console.error("Failed to authenticate:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const formContent = (
    <>
      {/* Header with gradient text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {isSignin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isSignin
            ? "Sign in to continue to your dashboard"
            : "Join us today and get started"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleAuth} className="space-y-6">
        {/* Name field for signup */}
        {!isSignin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Full Name
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400"
                placeholder="Enter your full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Email field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Email Address
          </label>
          <div className="relative">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
            loading
              ? "opacity-70 cursor-not-allowed scale-95"
              : isSignin
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isSignin ? "Signing In..." : "Creating Account..."}
            </div>
          ) : isSignin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Footer link */}
        <div className="text-center pt-4">
          <p className="text-gray-600 text-sm">
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => router.push(isSignin ? "/signup" : "/signin")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
            >
              {isSignin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 p-8 rounded-2xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10">{formContent}</div>
        </Card>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-10 blur-xl -z-10 transform scale-105"></div>
      </div>
    </div>
  );
}
