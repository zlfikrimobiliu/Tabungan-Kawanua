"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { PiggyBank, Calendar, TrendingUp, CheckCircle2, Clock, FileText, User } from "lucide-react";
import { memo, useMemo } from "react";
import { formatScheduleLabel, getWeekDate } from "@/lib/schedule";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const SavingsReport = memo(function SavingsReport() {
  const { 
    members, 
    getTotalTabungan, 
    getAllMembersSavingsReport,
    savingsSchedule,
    completedWeeks 
  } = useStore();
  
  const totalTabungan = getTotalTabungan();
  const activeMembers = members.filter((m) => m.isActive);
  const savingsReport = getAllMembersSavingsReport();
  
  // Urutkan berdasarkan total count (yang paling banyak menabung di atas)
  const sortedReport = useMemo(() => {
    return [...savingsReport].sort((a, b) => {
      // Prioritas: yang sudah selesai menabung (ada di completedWeeks)
      const aCompleted = a.weeks.some(w => completedWeeks.includes(w));
      const bCompleted = b.weeks.some(w => completedWeeks.includes(w));
      if (aCompleted !== bCompleted) return aCompleted ? -1 : 1;
      
      // Kemudian urutkan berdasarkan total count
      return b.totalCount - a.totalCount;
    });
  }, [savingsReport, completedWeeks]);
  
  // Format tanggal untuk display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: idLocale });
    } catch {
      return dateString;
    }
  };
  
  // Format tanggal singkat
  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMM yyyy", { locale: idLocale });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Rekap Tabungan</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detail lengkap tabungan semua anggota</p>
          </div>
        </div>
      </div>

      {/* Total Tabungan */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="w-5 h-5 opacity-90" />
          <p className="text-sm opacity-90 font-medium">Total Tabungan Keseluruhan</p>
        </div>
        <p className="text-3xl font-bold">Rp {totalTabungan.toLocaleString("id-ID")}</p>
        <p className="text-xs opacity-75 mt-1">
          Akumulasi dari semua minggu yang sudah selesai
        </p>
      </motion.div>

      {/* List Anggota */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {sortedReport.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>Belum ada data tabungan.</p>
          </div>
        ) : (
          sortedReport.map((report, index) => {
            const member = members.find((m) => m.id === report.memberId);
            const isCompleted = report.weeks.some(w => completedWeeks.includes(w));
            
            return (
              <motion.div
                key={report.memberId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}>
                      {report.memberName.charAt(report.memberName.length - 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm sm:text-base">
                          {report.memberName}
                        </h3>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {report.totalCount} kali menabung
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      Rp {report.totalAmount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total setoran
                    </p>
                  </div>
                </div>

                {/* Detail */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  {/* Tabungan Pertama */}
                  {report.firstSaving && (
                    <div className="flex items-start gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-600 dark:text-gray-400">Tabungan pertama:</span>{" "}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          Minggu ke-{report.firstSaving.week}
                        </span>
                        {" "}({formatDateShort(report.firstSaving.date)})
                      </div>
                    </div>
                  )}

                  {/* Tabungan Terakhir */}
                  {report.lastSaving && report.lastSaving.week !== report.firstSaving?.week && (
                    <div className="flex items-start gap-2 text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-600 dark:text-gray-400">Tabungan terakhir:</span>{" "}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          Minggu ke-{report.lastSaving.week}
                        </span>
                        {" "}({formatDateShort(report.lastSaving.date)})
                      </div>
                    </div>
                  )}

                  {/* Daftar Minggu */}
                  {report.weeks.length > 0 && (
                    <div className="flex items-start gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-600 dark:text-gray-400">Minggu yang sudah menabung:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {report.weeks.map((week) => {
                            const weekDate = getWeekDate(savingsSchedule, week);
                            const isWeekCompleted = completedWeeks.includes(week);
                            return (
                              <span
                                key={week}
                                className={`px-2 py-1 rounded-md text-xs font-medium transition-all hover:scale-105 ${
                                  isWeekCompleted
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                }`}
                                title={`Minggu ke-${week} - ${formatScheduleLabel(weekDate)}`}
                              >
                                M{week}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
});

export default SavingsReport;

