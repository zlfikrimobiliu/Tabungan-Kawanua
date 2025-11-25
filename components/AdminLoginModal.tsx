"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/store/store";
import { obfuscatePassword, deobfuscatePassword, secureCompare, clearSensitiveData } from "@/lib/security";
import { DEFAULT_PASSWORD } from "@/lib/password-constant";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const { adminPassword, setAdminPassword } = useStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Deobfuscate password untuk comparison (tidak pernah di-expose ke DOM)
  const getStoredPassword = (): string => {
    if (!adminPassword) return DEFAULT_PASSWORD; // Default password (tidak hardcoded)
    try {
      return deobfuscatePassword(adminPassword);
    } catch {
      // Jika deobfuscation gagal, mungkin masih plain text (migration)
      return adminPassword === DEFAULT_PASSWORD ? DEFAULT_PASSWORD : adminPassword;
    }
  };
  
  // Cek apakah password sudah di-set (tidak kosong)
  // isFirstTime hanya true jika adminPassword benar-benar kosong atau belum pernah di-set
  const [isFirstTime, setIsFirstTime] = useState(!adminPassword);
  
  // Sync isFirstTime dengan adminPassword
  useEffect(() => {
    // Jika adminPassword kosong, set default password otomatis
    if (!adminPassword && typeof window !== "undefined") {
      // Set password default otomatis saat pertama kali (tidak hardcoded)
      setAdminPassword(DEFAULT_PASSWORD);
      setIsFirstTime(false); // Setelah di-set, bukan first time lagi
    } else if (adminPassword) {
      // Password sudah ada, bukan first time
      setIsFirstTime(false);
    }
  }, [adminPassword, setAdminPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // JANGAN PERNAH log password ke console!
    const inputPassword = password.trim();
    const correctPassword = getStoredPassword();
    
    // Password sudah di-set, hanya login (tidak bisa diubah lagi)
    // Password default sudah ter-set otomatis
    // Login dengan password - secure comparison
    // Tidak akan log password ke console
    // Menggunakan secureCompare untuk mencegah timing attacks
    if (!secureCompare(inputPassword, correctPassword)) {
      setError("Password salah!");
      setPassword("");
      clearSensitiveData(inputPassword);
      return;
    }
    // Clear password dari memory segera setelah digunakan
    setPassword("");
    clearSensitiveData(inputPassword);
    onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-700 relative">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Login Admin
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Masukkan password untuk akses admin
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Masukkan password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      data-secure="true"
                      data-safelogin="true"
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-all"
                      autoFocus
                      // Prevent password from being saved by browser
                      onBlur={(e) => {
                        // Clear value attribute to prevent inspection
                        if (e.target instanceof HTMLInputElement && e.target.type === "password") {
                          // Value sudah di-handle oleh React state, tidak perlu clear
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Lock className="w-4 h-4" />
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  💡 Password default sudah di-set (tidak bisa diubah)
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

