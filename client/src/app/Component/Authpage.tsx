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
        // server might return { message: '...' }
        throw new Error(data?.message || `Error: ${response.status}`);
      }

      // If the server returns a token for signin or signup
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Authentication successful! token saved");
        router.push("/home");
        return;
      }

      // Signup success without token
      if (!isSignin) {
        // Common signup flows: server returns { success: true } or { message: 'User created' }
        console.log("Signup successful, redirecting to signin");
        router.push("/signin");
        return;
      }

      // Fallback
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

  // Render Sign In Form
  if (isSignin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="bg-white shadow-lg w-full max-w-sm p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <form onSubmit={handleAuth}>
            <input
              className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border border-gray-300 rounded-lg p-3 mb-6 w-full"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className={`w-full font-semibold p-3 rounded-lg ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </form>
        </Card>
      </div>
    );
  }

  // Render Sign Up Form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="bg-white shadow-lg w-full max-w-sm p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleAuth}>
          <input
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 rounded-lg p-3 mb-6 w-full"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className={`w-full font-semibold p-3 rounded-lg ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </Card>
    </div>
  );
}
