"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// --- TypeScript Interfaces ---
interface Author {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  text: string;
  author: Author;
}

interface PinDetails {
  id: number;
  title: string;
  image: string;
  externallink: string;
  author: Author;
  comments: Comment[];
}

// --- Reusable UI Components ---

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-transparent border-t-orange-400 border-r-amber-400 rounded-full animate-spin"></div>
      <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-yellow-400 border-l-orange-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
      <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 text-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="relative z-10 backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20">
      <div className="text-6xl mb-6 animate-bounce">💔</div>
      <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
        Something Went Wrong
      </h2>
      <p className="text-orange-200 text-lg">{message}</p>
      <Link href="/home">
        <button className="mt-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25">
          Return to Home
        </button>
      </Link>
    </div>
  </div>
);

const AuthorInfo = ({ author }: { author: Author }) => (
  <div className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border border-white/30 hover:from-white/90 hover:to-white/80 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-amber-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {author.name.charAt(0).toUpperCase()}
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
    </div>
    <div>
      <p className="font-bold text-lg text-slate-800 group-hover:text-orange-800 transition-colors">
        {author.name}
      </p>
      <p className="text-sm text-orange-600 font-medium bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
        ✨ Pin Creator
      </p>
    </div>
  </div>
);

const CommentCard = ({ comment }: { comment: Comment }) => (
  <div className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white hover:from-orange-50 hover:to-amber-50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 border border-transparent hover:border-orange-200">
    <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 group-hover:from-orange-400 group-hover:to-amber-400 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
      {comment.author.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 group-hover:bg-white/90 transition-all duration-300">
      <p className="font-bold text-sm text-slate-700 mb-1 group-hover:text-orange-700 transition-colors">
        {comment.author.name}
      </p>
      <p className="text-slate-600 leading-relaxed">{comment.text}</p>
    </div>
  </div>
);

// --- Main Pin Detail Page Component ---

export default function PinPage() {
  const [pin, setPin] = useState<PinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;

    const fetchPinDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          return;
        }

        const endpoint = `${baseUrl}/api/pins/${id}`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          throw new Error("Sorry, we couldn't find that pin.");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch pin details. Please try again.");
        }

        const data: PinDetails = await response.json();
        setPin(data);
      } catch (err: any) {
        console.error("Error fetching pin:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPinDetails();
  }, [id, router, baseUrl]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!pin) return <ErrorDisplay message="Pin data is not available." />;

  const imageUrl = `${baseUrl}${pin.image}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 flex justify-center items-start min-h-screen">
        <div className="max-w-6xl w-full mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-3 text-white font-semibold hover:text-orange-300 transition-all duration-300 group bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-xl hover:shadow-orange-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-110"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Gallery
          </button>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-orange-500/20 transition-all duration-500 lg:flex lg:min-h-[700px]">
            {/* Image Section - Perfect Center Alignment */}
            <div className="lg:w-3/5 relative group overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
              <div
                className={`w-full h-96 lg:h-[700px] flex items-center justify-center transition-all duration-700 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                }`}
              >
                <img
                  src={imageUrl}
                  alt={pin.title}
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-700 shadow-2xl rounded-2xl"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x800/fb923c/ffffff?text=Image+Not+Found";
                    setImageLoaded(true);
                  }}
                />
              </div>

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              {/* Floating Action Button */}
              <button className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-xl border border-white/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>

            {/* Details Section */}
            <div className="lg:w-2/5 p-6 lg:p-8 flex flex-col bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
              {/* Header */}
              <header className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text leading-tight mb-4">
                  {pin.title}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Active Link
                  </span>
                </div>
                <a
                  href={pin.externallink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-amber-600 transition-all duration-300 font-medium break-all hover:underline decoration-2 underline-offset-4 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-2 rounded-xl hover:shadow-lg hover:shadow-orange-500/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Visit Source
                </a>
              </header>

              {/* Author Section */}
              <div className="mb-8">
                <AuthorInfo author={pin.author} />
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-slate-700 to-orange-700 bg-clip-text">
                    💬 Comments
                  </h2>
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {pin.comments.length}
                  </span>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
                  {pin.comments.length > 0 ? (
                    pin.comments.map((comment, index) => (
                      <div key={comment.id}>
                        <CommentCard comment={comment} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">💭</div>
                      <p className="text-slate-500 font-medium">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Comment Form */}
              <div className="mt-8 border-t border-orange-200/50 pt-6">
                <form className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    👤
                  </div>
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 border border-white/50 hover:bg-white/90"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
