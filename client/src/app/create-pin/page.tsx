"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// A simple arrow icon component for the back button
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export default function CreatePin() {
  const [title, setTitle] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a URL for the image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    // Use FormData to send both file and text data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("externallink", externalLink);
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("You must be logged in to create a pin.");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = `${baseUrl}/api/pins`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          // Note: When using FormData, the browser automatically sets the 'Content-Type'
          // header to 'multipart/form-data' with the correct boundary.
          // Do not set it manually.
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create pin.");
      }

      // On success, redirect to the homepage to see the new pin
      router.push("/home");
    } catch (err: any) {
      console.error("Pin creation failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload and Preview Column */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 h-full">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="w-full h-auto rounded-lg object-contain max-h-[400px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload an image
                    </span>
                    <span className="block text-xs text-gray-500">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      name="image"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Form Fields Column */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-6">Create a Pin</h1>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add a title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="externalLink"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      External Link
                    </label>
                    <input
                      type="url"
                      id="externalLink"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                  )}
                  <button
                    type="submit"
                    className={`w-full font-semibold p-3 rounded-lg text-white ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Creating Pin..." : "Create Pin"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
