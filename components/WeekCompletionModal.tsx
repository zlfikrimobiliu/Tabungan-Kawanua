"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { useStore } from "@/store/store";
import { formatScheduleLabel, getWeekDate } from "@/lib/schedule";
import { memo } from "react";

interface WeekCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: number;
}

const WeekCompletionModal = memo(function WeekCompletionModal({
  isOpen,
  onClose,
  week,
}: WeekCompletionModalProps) {
  const { savingsSchedule, completedWeeks, completeWeek, uncompleteWeek, getWeekReport, members } = useStore();
  const isCompleted = completedWeeks.includes(week);
  const report = getWeekReport(week);
  const weekDate = getWeekDate(savingsSchedule, week);
  const activeMembers = members.filter((m) => m.isActive);
  
  // Cek apakah semua anggota sudah menabung dan ada yang menerima
  const allSaved = activeMembers.every((member) => {
    const saved = report.members.find((m) => m.name === member.name)?.saved || 0;
    return saved >= 100000; // Minimal 100rb
  });
  
  const hasReceiver = report.members.some((m) => m.received > 0);

  const handleToggle = () => {
    if (isCompleted) {
      uncompleteWeek(week);
    } else {
      if (confirm(`Konfirmasi: Minggu ke-${week} sudah selesai?\n\nSetelah dikonfirmasi, minggu ini akan ditandai selesai dan kas akan direset.`)) {
        completeWeek(week);
      }
    }
    onClose();
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Minggu ke-{week}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatScheduleLabel(weekDate)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className={`p-4 rounded-lg ${
                  isCompleted 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}>
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="font-semibold text-green-800 dark:text-green-300">
                          Minggu ini sudah selesai
                        </p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                          Minggu ini belum selesai
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Report Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                      Total Tabungan
                    </p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      Rp {report.totalSaved.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                      Total Penerimaan
                    </p>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                      Rp {report.totalReceived.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                      Sisa Kas
                    </p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      Rp {report.kas.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Detail Per Anggota */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Detail Per Anggota
                  </h3>
                  <div className="space-y-2">
                    {report.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            {member.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <p className="text-gray-500 dark:text-gray-400">Tabungan</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400">
                              Rp {member.saved.toLocaleString("id-ID")}
                            </p>
                          </div>
                          {member.received > 0 && (
                            <div className="text-right">
                              <p className="text-gray-500 dark:text-gray-400">Penerimaan</p>
                              <p className="font-semibold text-red-600 dark:text-red-400">
                                Rp {member.received.toLocaleString("id-ID")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning jika belum lengkap */}
                {!isCompleted && (!allSaved || !hasReceiver) && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      <strong>Perhatian:</strong> Pastikan semua anggota sudah menabung dan ada yang menerima sebelum menandai minggu ini selesai.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleToggle}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    isCompleted
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isCompleted ? "Batalkan Konfirmasi" : "Konfirmasi Selesai"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default WeekCompletionModal;

