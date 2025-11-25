"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/store";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminLogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: AdminLogoutModalProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleLogout = () => {
    if (confirmText.trim().toLowerCase() === "logout") {
      onConfirm();
      setConfirmText("");
      onClose();
    }
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
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl mb-4 shadow-lg"
                >
                  <LogOut className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Logout Admin
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ketik "logout" untuk konfirmasi keluar dari mode admin
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={(e) => { e.preventDefault(); handleLogout(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Konfirmasi Logout
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Ketik 'logout' untuk konfirmasi"
                    autoComplete="off"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-all"
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Ketik <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">logout</span> untuk keluar
                  </p>
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
                    disabled={confirmText.trim().toLowerCase() !== "logout"}
                    className={`flex-1 btn-primary flex items-center justify-center gap-2 rounded-xl ${
                      confirmText.trim().toLowerCase() !== "logout"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Setelah logout, Anda perlu login lagi untuk akses admin
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

