"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type Pin = {
  id: number;
  title: string;
  image?: string; 
  author: {
    id: number;
    name: string;
  };
};

// ------------------------
// Small presentational components
// ------------------------
const LoadingSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse space-y-3">
        <div className="bg-gray-300 aspect-[4/5] rounded-lg" />
        <div className="h-3 bg-gray-300 rounded w-3/4" />
        <div className="h-2 bg-gray-300 rounded w-1/2" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="text-center py-24">
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No pins yet</h2>
    <p className="text-gray-500 mb-6">
      Be the first to add something beautiful.
    </p>
    <button
      onClick={onCreate}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow"
    >
      Create a Pin
    </button>
  </div>
);

function PinCard({ pin, onOpen }: { pin: Pin; onOpen: (id: number) => void }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const imgSrc = pin.image ? `${baseUrl}${pin.image}` : "/placeholder.png";

  return (
    <article
      onClick={() => onOpen(pin.id)}
      role="button"
      tabIndex={0}
      className="group cursor-pointer relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="bg-gray-100 aspect-[4/5]">
        <img
          src={imgSrc}
          alt={pin.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 right-3 pointer-events-auto">
          <button
            aria-label="Save pin"
            title="Save"
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              // future: implement save/favorite action
              alert("Saved!");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v12l7-3 7 3V5a2 2 0 00-2-2H5z" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm truncate">
            {pin.title}
          </h3>
          <p className="text-gray-200 text-xs">by {pin.author.name}</p>
        </div>
      </div>
    </article>
  );
}

// ------------------------
// Main page
// ------------------------
export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const fetchPins = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const endpoint = `${baseUrl}/api/pins`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch pins");

        const data: Pin[] = await res.json();
        if (!mounted) return;
        setPins(data);
      } catch (err: any) {
        if (!mounted) return;
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchPins();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = pins.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Discover</h1>
            <p className="text-sm text-gray-500">
              Explore beautiful pins shared by creators
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pins..."
                className="w-full sm:w-64 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              onClick={() => router.push("/create-pin")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Create
            </button>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={10} />
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-red-700">
            {error}
          </div>
        ) : pins.length === 0 ? (
          <EmptyState onCreate={() => router.push("/create-pin")} />
        ) : (
          <section aria-live="polite">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((pin) => (
                <PinCard
                  key={pin.id}
                  pin={pin}
                  onOpen={(id) => router.push(`/pin/${id}`)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-8 text-center text-gray-500">
                No results for "{query}"
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
