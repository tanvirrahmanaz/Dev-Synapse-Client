/** @type {import('tailwindcss').Config} */
module.exports = {
  // আপনার প্রজেক্টের ফাইল পাথগুলো এখানে যুক্ত করুন
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // এখানে আমরা DaisyUI প্লাগইন এবং আমাদের কাস্টম থিম কনফিগার করব
  plugins: [require("daisyui")],

  // DaisyUI কনফিগারেশন
  daisyui: {
    themes: [
      {
        greentech: {
          // আপনার দেওয়া রঙগুলো DaisyUI-এর নামের সাথে ম্যাপ করা হয়েছে
          "primary": "#22C55E",    // Primary: Green-500
          "accent": "#10B981",     // Accent: Emerald-500
          
          // অন্যান্য প্রয়োজনীয় রঙ যুক্ত করা হয়েছে একটি সম্পূর্ণ থিমের জন্য
          "secondary": "#34D399",  // একটি পরিপূরক সবুজ রঙ
          "neutral": "#374151",    // Gray-700, নিউট্রাল টেক্সট বা ব্যাকগ্রাউন্ডের জন্য
          
          // ব্যাকগ্রাউন্ড এবং টেক্সটের রঙ
          "base-100": "#F9FAFB",   // Background: Gray-50
          "base-content": "#111827", // Text: Gray-900

          // ইনফরমেশন, সফলতা, ওয়ার্নিং এবং এরর মেসেজের জন্য রঙ
          "info": "#3B82F6",       // Blue-500
          "success": "#22C55E",    // আপনার প্রাইমারি রঙটিই সফলতার জন্য পারফেক্ট
          "warning": "#F59E0B",    // Amber-500
          "error": "#EF4444",       // Red-500
        },
      },
      // আপনি চাইলে অন্য ডিফল্ট থিমও রাখতে পারেন, যেমন 'light' বা 'dark'
      "light",
      "dark",
    ],
  },
}