"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { SavingsSchedule } from "@/store/store";
import { formatScheduleLabel, getWeekDate } from "@/lib/schedule";

interface WeekScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  totalWeeks: number;
  savingsSchedule: SavingsSchedule;
}

export default function WeekScheduleModal({
  isOpen,
  onClose,
  currentWeek,
  totalWeeks,
  savingsSchedule,
}: WeekScheduleModalProps) {
  const weeks = Array.from({ length: totalWeeks }, (_, index) => index + 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Jadwal Mingguan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Berdasarkan jadwal admin ({currentWeek} minggu berjalan)
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {weeks.map((weekNumber) => {
                  const date = getWeekDate(savingsSchedule, weekNumber);
                  const isCurrent = weekNumber === currentWeek;

                  return (
                    <div
                      key={weekNumber}
                      className={`px-5 py-4 flex items-start gap-4 ${
                        isCurrent ? "bg-red-50/70 dark:bg-red-900/20" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                          isCurrent
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {weekNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          Minggu ke-{weekNumber}
                          {isCurrent && <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Saat ini)</span>}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatScheduleLabel(date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Jadwal berdasarkan hari {["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][savingsSchedule.dayOfWeek]} pukul{" "}
                {savingsSchedule.time} WITA. Admin dapat mengubah tanggal mulai di Panel Admin.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

