"use client";

import { motion } from "framer-motion";
import { MessageSquare, Copy, X, Check } from "lucide-react";
import { useState } from "react";

interface WhatsAppTemplateProps {
  memberName: string;
  week: number;
  amount: number;
  onClose: () => void;
}

export default function WhatsAppTemplate({
  memberName,
  week,
  amount,
  onClose,
}: WhatsAppTemplateProps) {
  const [copied, setCopied] = useState(false);

  const memberCount = Math.round(amount / 100000);
  
  const message = `🎉 *PENGUMUMAN ARISAN MINGGU KE-${week}*

Selamat kepada *${memberName}* yang telah menerima dana arisan sebesar:
💰 *Rp ${amount.toLocaleString("id-ID")}*
(${memberCount} anggota × Rp 100.000)

Terima kasih kepada semua anggota yang telah menabung dengan tertib.

📌 *Info Rekening:*
Bank: BCA
No. Rek: 6115876019
Atas Nama: FIKRI MOBILIU

Semoga arisan ini bermanfaat untuk kita semua! 🙏`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Template WhatsApp</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-3">
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
          {message}
        </pre>
      </div>

      <div className="flex gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <MessageSquare className="w-4 h-4" />
          Buka WhatsApp
        </a>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

