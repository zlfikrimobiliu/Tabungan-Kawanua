"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { CheckCircle2, Circle, Calendar, User, Edit2, Info } from "lucide-react";
import { useState, memo } from "react";
import EditMemberModal from "./EditMemberModal";
import WeekScheduleModal from "./WeekScheduleModal";
import { formatScheduleLabel, getWeekDate } from "@/lib/schedule";

const MembersList = memo(function MembersList() {
  const {
    members,
    currentWeek,
    isAdmin,
    getCurrentReceiver,
    savingsSchedule,
  } = useStore();

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [showWeekSchedule, setShowWeekSchedule] = useState(false);
  const currentReceiver = getCurrentReceiver();
  const activeMembers = members.filter((m) => m.isActive);

  const hasReceived = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member?.weeksReceived.includes(currentWeek) || false;
  };

  const hasSaved = (memberId: string, week: number) => {
    const transactions = useStore.getState().transactions;
    return transactions.some(
      (t) =>
        t.memberId === memberId &&
        t.week === week &&
        t.type === "saving" &&
        t.status === "completed"
    );
  };

  const allMembersSaved = (week: number) => {
    const transactions = useStore.getState().transactions;
    return activeMembers.every((m) => {
      return transactions.some(
        (t) => t.memberId === m.id && t.week === week && t.type === "saving"
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Daftar Anggota
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Kelola status tabungan anggota</p>
          </div>
        </div>
        <button
          onClick={() => setShowWeekSchedule(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          title="Lihat jadwal tanggal tiap minggu"
        >
          <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>Minggu ke-{currentWeek}</span>
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {activeMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>Belum ada anggota. Admin dapat menambahkan anggota baru.</p>
          </div>
        ) : (
          activeMembers.map((member, index) => {
          const isCurrentReceiver = currentReceiver?.id === member.id;
          const received = hasReceived(member.id);
          const saved = hasSaved(member.id, currentWeek);
          
          // Hitung minggu berikutnya anggota ini akan menerima
          // Sistem rotasi: setiap anggota menerima secara bergilir
          // Contoh: 5 anggota, minggu 1=anggota[0], minggu 2=anggota[1], ..., minggu 6=anggota[0] lagi
          const currentReceiverIndex = (currentWeek - 1) % activeMembers.length;
          let weeksToReceive: number;
          
          if (index === currentReceiverIndex) {
            // Anggota ini adalah penerima minggu ini
            weeksToReceive = currentWeek;
          } else if (index > currentReceiverIndex) {
            // Anggota ini akan menerima di minggu-minggu berikutnya dalam siklus ini
            // Contoh: currentWeek=2 (index 1), anggota index 2 akan menerima di minggu 3
            weeksToReceive = currentWeek + (index - currentReceiverIndex);
          } else {
            // Anggota ini sudah menerima di siklus ini, akan menerima lagi di siklus berikutnya
            // Contoh: currentWeek=2 (index 1), anggota index 0 sudah menerima di minggu 1, akan menerima lagi di minggu 6
            weeksToReceive = currentWeek + (activeMembers.length - currentReceiverIndex) + index;
          }
          
          const scheduleDate = formatScheduleLabel(getWeekDate(savingsSchedule, weeksToReceive));
          
          // Cari minggu-minggu sebelumnya di mana anggota sudah menerima
          const previousReceivedWeeks = member.weeksReceived
            .filter(w => w < currentWeek)
            .sort((a, b) => b - a); // Urutkan dari terbaru ke terlama
          
          // Hitung tanggal untuk minggu-minggu yang sudah diterima
          const previousReceivedInfo = previousReceivedWeeks.map(week => ({
            week,
            date: formatScheduleLabel(getWeekDate(savingsSchedule, week))
          }));

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isCurrentReceiver
                  ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 shadow-md"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      isCurrentReceiver
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}
                  >
                    {member.name.charAt(member.name.length - 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{member.name}</h3>
                      {isAdmin && (
                        <button
                          onClick={() => setEditingMemberId(member.id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {isCurrentReceiver && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    Penerima Minggu Ini
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {/* Status Menabung */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Menabung</span>
                  </div>
                  {isAdmin ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (saved) {
                          useStore.getState().unmarkSaved(member.id, currentWeek);
                        } else {
                          useStore.getState().markSaved(member.id, currentWeek);
                        }
                      }}
                      className={`${
                        saved
                          ? "text-green-600 hover:text-red-600"
                          : "text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400"
                      } transition-colors cursor-pointer`}
                      title={saved ? "Klik untuk uncheck (batalkan menabung)" : "Klik untuk tandai sudah menabung"}
                    >
                      {saved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </motion.button>
                  ) : saved ? (
                    <div title="Sudah menabung">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div title="Belum menabung">
                      <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </motion.div>

                {/* Detail Jadwal Mingguan */}
                <div className="col-span-1 sm:col-span-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Jadwal minggu ke-{weeksToReceive}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-100">{scheduleDate}</p>
                </div>

                {/* Status Menerima */}
                {isCurrentReceiver && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      allMembersSaved(currentWeek)
                        ? "bg-gradient-to-r from-red-50 to-white dark:from-red-900/30 dark:to-gray-700 border-red-200 dark:border-red-600"
                        : "bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/30 dark:to-gray-700 border-yellow-200 dark:border-yellow-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${
                        allMembersSaved(currentWeek)
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`} />
                      <div>
                        <span className={`text-sm font-semibold ${
                          allMembersSaved(currentWeek)
                            ? "text-red-700 dark:text-red-300"
                            : "text-yellow-700 dark:text-yellow-300"
                        }`}>
                          Menerima
                        </span>
                        {!allMembersSaved(currentWeek) && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                            Tunggu semua menabung dulu
                          </p>
                        )}
                      </div>
                    </div>
                    {isAdmin ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (received) {
                            useStore.getState().unmarkReceived(member.id, currentWeek);
                          } else {
                            useStore.getState().markReceived(member.id, currentWeek);
                          }
                        }}
                        disabled={!allMembersSaved(currentWeek) && !received}
                        className={`${
                          received
                            ? "text-green-600 hover:text-red-600"
                            : allMembersSaved(currentWeek)
                            ? "text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400"
                            : "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                        } transition-colors`}
                        title={
                          received
                            ? "Klik untuk uncheck (batalkan menerima)"
                            : allMembersSaved(currentWeek)
                            ? "Klik untuk tandai sudah menerima"
                            : "Semua anggota harus menabung dulu sebelum bisa menerima"
                        }
                      >
                        {received ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </motion.button>
                    ) : received ? (
                      <div title="Sudah menerima">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div title={allMembersSaved(currentWeek) ? "Belum menerima" : "Tunggu semua menabung dulu"}>
                        <Circle className={`w-5 h-5 ${
                          allMembersSaved(currentWeek)
                            ? "text-gray-300 dark:text-gray-600"
                            : "text-yellow-300 dark:text-yellow-700"
                        }`} />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {!isCurrentReceiver && (
                <div className="mt-3 space-y-1">
                  {previousReceivedInfo.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Sudah menerima:</span>{" "}
                      {previousReceivedInfo.map((info, idx) => (
                        <span key={info.week}>
                          {idx > 0 && ", "}
                          minggu ke-{info.week} ({info.date})
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Akan menerima pada minggu ke-{weeksToReceive} ({scheduleDate})
                    {previousReceivedInfo.length > 0 && " (penerimaan berikutnya)"}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })
        )}
      </div>

      {editingMemberId && (
        <EditMemberModal
          memberId={editingMemberId}
          isOpen={!!editingMemberId}
          onClose={() => setEditingMemberId(null)}
        />
      )}
      <WeekScheduleModal
        isOpen={showWeekSchedule}
        onClose={() => setShowWeekSchedule(false)}
        currentWeek={currentWeek}
        totalWeeks={Math.max(activeMembers.length, currentWeek + 4)}
        savingsSchedule={savingsSchedule}
      />
    </motion.div>
  );
});

export default MembersList;

