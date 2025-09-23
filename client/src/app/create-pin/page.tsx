"use client";

import { useState } from "react";

// Enhanced Icons with modern styling
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform group-hover:-translate-x-1"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const UploadIcon = () => (
  <svg
    className="w-16 h-16 text-slate-400 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3l3.057 4.5L12 5l3.943 2.5L19 3v18l-3.057-2L12 21l-3.943-2L5 21V3z"
    />
  </svg>
);

export default function CreatePin() {
  const [title, setTitle] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      // Validate file type and size
      const validTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (PNG, JPG, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }

      setError(null);
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for your pin.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("externallink", externalLink);
    formData.append("image", imageFile);

    try {
      // In a real app, you'd get this from your auth system
      const token = localStorage?.getItem("authToken");
      if (!token) {
        throw new Error("You must be logged in to create a pin.");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = `${baseUrl}/api/pins`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create pin.");
      }

      setSuccess(true);

      // Redirect after showing success animation
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (err: any) {
      console.error("Pin creation failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Pin Created Successfully! 🎉
          </h2>
          <p className="text-slate-600 text-lg">
            Redirecting you back to your pins...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleBack}
              className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-slate-800 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <ArrowLeftIcon />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Create New Pin
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Share your inspiration with the world
              </p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                {/* Image Upload Section */}
                <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <SparkleIcon />
                    Upload Your Image
                  </h2>

                  <div
                    className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 h-full min-h-[400px] flex items-center justify-center ${
                      dragOver
                        ? "border-rose-400 bg-rose-50"
                        : imagePreview
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-white hover:border-rose-300 hover:bg-rose-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="w-full p-4">
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Selected preview"
                            className="w-full h-auto rounded-xl object-contain max-h-[350px] shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeImage}
                              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-green-600 font-semibold">
                            ✓ Image uploaded successfully
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Click to replace or drag a new image
                          </p>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-center p-8 w-full">
                        <div className="flex flex-col items-center">
                          <UploadIcon />
                          <h3 className="text-xl font-bold text-slate-700 mb-2">
                            {dragOver
                              ? "Drop your image here!"
                              : "Upload an Image"}
                          </h3>
                          <p className="text-slate-500 mb-4">
                            Drag & drop or click to browse
                          </p>
                          <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                            Choose File
                          </div>
                          <p className="text-xs text-slate-400 mt-4">
                            PNG, JPG, WEBP • Max 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/webp, image/jpg"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Form Fields Section */}
                <div className="p-8 lg:p-12 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8">
                      Pin Details
                    </h2>

                    {/* Title Input */}
                    <div className="mb-8">
                      <label
                        htmlFor="title"
                        className="block text-sm font-semibold text-slate-700 mb-3"
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your pin a catchy title..."
                        className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all text-lg font-medium bg-white/80 backdrop-blur-sm"
                        required
                        maxLength={100}
                      />
                      <div className="mt-2 text-right text-sm text-slate-400">
                        {title.length}/100
                      </div>
                    </div>

                    {/* External Link Input */}
                    <div className="mb-8">
                      <label
                        htmlFor="externalLink"
                        className="block text-sm font-semibold text-slate-700 mb-3"
                      >
                        Website Link *
                      </label>
                      <input
                        type="url"
                        id="externalLink"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all text-lg font-medium bg-white/80 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Section */}
                  <div className="border-t border-slate-200 pt-8">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⚠️</span>
                          <p className="text-red-700 font-semibold">{error}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !imageFile || !title.trim()}
                      className={`w-full font-bold p-4 rounded-2xl text-lg shadow-xl transition-all duration-300 ${
                        loading || !imageFile || !title.trim()
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white hover:shadow-2xl transform hover:scale-[1.02]"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Your Pin...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <span>🚀</span>
                          Create Pin
                        </span>
                      )}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-4">
                      By creating a pin, you agree to share it publicly
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
