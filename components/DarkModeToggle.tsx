"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/store/store";
import { useEffect } from "react";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useStore();

  // Apply dark mode class on mount and when darkMode changes (default to dark)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldBeDark = darkMode !== undefined ? darkMode : true; // Default to dark
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setDarkMode(!darkMode)}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 shadow-lg shadow-gray-800/30"
          : "bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg"
      }`}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
}

