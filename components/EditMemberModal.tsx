"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore, type Member } from "@/store/store";
import Toast from "./Toast";

interface EditMemberModalProps {
  memberId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditMemberModal({
  memberId,
  isOpen,
  onClose,
}: EditMemberModalProps) {
  const { members, updateMember } = useStore();
  const member = members.find((m) => m.id === memberId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Sync state when modal opens or member changes
  useEffect(() => {
    if (member && isOpen) {
      setName(member.name || "");
      setEmail(member.email || "");
      setPhone(member.phone || "");
    }
  }, [member, isOpen, memberId]);

  if (!member) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!name.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    // Update member dengan data baru
    const updatedData: Partial<Member> = {
      name: name.trim(),
    };
    
    // Hanya tambahkan email jika ada
    if (email.trim()) {
      updatedData.email = email.trim();
    } else {
      updatedData.email = undefined;
    }
    
    // Hanya tambahkan phone jika ada
    if (phone.trim()) {
      updatedData.phone = phone.trim();
    } else {
      updatedData.phone = undefined;
    }

    // Panggil updateMember dan pastikan state ter-update
    updateMember(memberId, updatedData);
    
    // Tampilkan toast notifikasi
    setShowToast(true);
    
    // Tutup modal setelah toast muncul (delay kecil untuk UX)
    setTimeout(() => {
      onClose();
    }, 500);
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
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Edit Anggota
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nama <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                    placeholder="Masukkan nama anggota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No. HP (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Toast Notification */}
          <Toast
            message="Nama berhasil disimpan"
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            duration={3000}
          />
        </>
      )}
    </AnimatePresence>
  );
}

