// app/page.tsx

"use client"; // This is a client component because it uses state (useState)

import React, { useState } from "react";
import { FaPinterest } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PinterestLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white shadow-sm w-full">
        <div className="flex items-center">
          <FaPinterest className="text-red-600 text-2xl mr-2" />
          <span className="font-bold text-xl text-red-600">Pinterest</span>
          <a href="#" className="ml-4 font-bold">
            Explore
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            About
          </a>
          <a
            href="#"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            Businesses
          </a>
          <a
            href="#"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            Create
          </a>
          <a
            href="#"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            News
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-full"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Log in
          </button>
          <button
            className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-full"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-grow flex flex-col items-center justify-center p-4"
        style={{
          // Placeholder gradient background for the image grid
          backgroundImage: "linear-gradient(to right, #f8f8f8, #e9e9e9)",
        }}
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
            Log in to get your ideas
          </h1>
        </div>
      </main>
    </div>
  );
}
