"use client";

import React, { useEffect, useState } from "react";

// Define a type for our Pin object for better TypeScript support
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
// Enhanced Components with Modern Design
// ------------------------

const LoadingSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="break-inside-avoid mb-4">
        <div className="animate-pulse bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-lg" 
             style={{ height: `${200 + Math.random() * 200}px` }}>
          <div className="p-4">
            <div className="h-4 bg-slate-300 rounded-full mb-2 w-3/4"></div>
            <div className="h-3 bg-slate-300 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="text-center py-20">
    <div className="mx-auto bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl h-32 w-32 flex items-center justify-center shadow-xl mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-rose-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
    <h2 className="text-4xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-4">
      Create Your First Pin
    </h2>
    <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
      Start your visual journey and inspire others with beautiful content
    </p>
    <button
      onClick={onCreate}
      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <span className="text-lg">✨</span>
      Create Your First Pin
      <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
    </button>
  </div>
);

function PinCard({ pin, onOpen }: { pin: Pin; onOpen: (id: number) => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const imgSrc = pin.image
    ? `${baseUrl}${pin.image}`
    : `https://picsum.photos/400/${300 + Math.floor(Math.random() * 400)}?random=${pin.id}`;

  return (
    <article
      onClick={() => onOpen(pin.id)}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer break-inside-avoid mb-4 bg-white"
    >
      {/* Image Container with Loading State */}
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imgSrc}
          alt={pin.title}
          loading="lazy"
          className={`w-full h-auto object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = `https://picsum.photos/400/500?random=${pin.id + 1000}`;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Save Button */}
        <button
          aria-label="Save pin"
          className="absolute top-4 right-4 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            // Create a beautiful save animation
            const button = e.currentTarget;
            button.classList.add('animate-bounce');
            setTimeout(() => button.classList.remove('animate-bounce'), 600);
            alert(`💾 Saved: "${pin.title}"`);
          }}
        >
          Save
        </button>

        {/* Quick Actions Menu */}
        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2 line-clamp-2">
          {pin.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {pin.author.name.charAt(0)}
          </div>
          <span className="text-xs text-slate-500 font-medium">{pin.author.name}</span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur"></div>
    </article>
  );
}

// ------------------------
// Main App Component
// ------------------------
export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Fetch real pins from your API
  useEffect(() => {
    let mounted = true;
    
    const fetchPins = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const endpoint = `${baseUrl}/api/pins`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch pins from the server.");

        const data: Pin[] = await res.json();
        if (mounted) setPins(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Something went wrong");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPins();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPins = pins.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreatePin = () => {
    // Use Next.js router to navigate to create pin page
    window.location.href = "/create-pin";
  };

  const handleOpenPin = (id: number) => {
    // Use Next.js router to navigate to pin detail page
    window.location.href = `/pin/${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <main className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <header className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Pins
                </h1>
                <p className="text-slate-500 font-medium">Discover & Create</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Enhanced Search */}
              <div className="relative flex-1 lg:flex-none group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur"></div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search amazing pins..."
                  className="relative w-full lg:w-80 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4 text-sm font-medium shadow-lg transition-all duration-300 focus:outline-none focus:border-rose-300 focus:shadow-xl placeholder-slate-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Create Button */}
              <button
                onClick={handleCreatePin}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:block">Create</span>
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>
          </header>

          {/* Content Area */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-8 text-center shadow-xl">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
              <p className="text-red-600">{error}</p>
            </div>
          ) : pins.length === 0 ? (
            <EmptyState onCreate={handleCreatePin} />
          ) : (
            <section>
              {/* Masonry Grid Layout */}
              <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
                {filteredPins.map((pin) => (
                  <PinCard
                    key={pin.id}
                    pin={pin}
                    onOpen={handleOpenPin}
                  />
                ))}
              </div>

              {/* No Results State */}
              {filteredPins.length === 0 && (
                <div className="mt-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">No pins match your search</h3>
                  <p className="text-slate-500 text-lg">Try searching for something else or create a new pin!</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}