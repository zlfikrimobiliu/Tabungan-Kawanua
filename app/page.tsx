"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useStore } from "@/store/store";
import { obfuscatePassword } from "@/lib/security";
import { DEFAULT_PASSWORD } from "@/lib/password-constant";

export default function Home() {
  const { initializeData, members, darkMode, setDarkMode, syncWithServer } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  // Apply dark mode immediately on mount (default to dark)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Apply dark mode immediately as default before rehydration
      document.documentElement.classList.add("dark");
      
      // Then sync with store state after rehydration
      const shouldBeDark = darkMode !== undefined ? darkMode : true;
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  useEffect(() => {
    setIsMounted(true);
    
    // Manual rehydration untuk memastikan data ter-load dari localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tabungan-kawanua-storage");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.state) {
            // Ada data di localStorage, sync dengan store
            useStore.setState({
              members: parsed.state.members || [],
              transactions: parsed.state.transactions || [],
              gallery: parsed.state.gallery || [],
              currentWeek: parsed.state.currentWeek || 1,
              savingsSchedule: parsed.state.savingsSchedule || { dayOfWeek: 1, time: "09:00" },
              adminEmail: parsed.state.adminEmail || "fikri.mobiliu@example.com",
              // Set password default jika kosong (tidak hardcoded)
              adminPassword: parsed.state.adminPassword || obfuscatePassword(DEFAULT_PASSWORD),
              darkMode: parsed.state.darkMode !== undefined ? parsed.state.darkMode : true, // Default to dark
            });
            
            // Apply dark mode (default to dark if not set)
            const shouldBeDark = parsed.state.darkMode !== undefined ? parsed.state.darkMode : true;
            if (shouldBeDark) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
            
            // Jika password kosong, set default password
            if (!parsed.state.adminPassword) {
              useStore.getState().setAdminPassword(DEFAULT_PASSWORD);
            }
            
            return; // Jangan initialize jika sudah ada data
          }
        } else {
          // Tidak ada data di localStorage, set password default dan dark mode default
          useStore.getState().setAdminPassword(DEFAULT_PASSWORD);
          // Set dark mode as default
          useStore.getState().setDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      } catch (error) {
        // Error parsing, set password default dan dark mode default
        useStore.getState().setAdminPassword(DEFAULT_PASSWORD);
        useStore.getState().setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
    
    // Sync dengan server terlebih dahulu
    syncWithServer().then(() => {
      // Setelah sync, initialize data jika perlu
      const timer = setTimeout(() => {
        initializeData();
      }, 300);
      return () => clearTimeout(timer);
    });

    // Setup interval untuk auto-sync setiap 5 detik (balance antara performa dan responsivitas)
    const syncInterval = setInterval(() => {
      syncWithServer();
    }, 5000);

    return () => {
      clearInterval(syncInterval);
    };
  }, [initializeData, syncWithServer]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Dashboard />
      </div>
    </main>
  );
}

