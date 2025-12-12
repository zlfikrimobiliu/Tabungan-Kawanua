"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Settings, Clock, Mail, MessageSquare, Copy, Check, UserPlus, Trash2, Info, Calendar, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { useState, memo } from "react";
import WhatsAppTemplate from "./WhatsAppTemplate";
import AddMemberModal from "./AddMemberModal";
import WeekCompletionModal from "./WeekCompletionModal";

const AdminPanel = memo(function AdminPanel() {
  const {
    currentWeek,
    setCurrentWeek,
    savingsSchedule,
    setSavingsSchedule,
    setSavingsStartDate,
    adminEmail,
    setAdminEmail,
    getCurrentReceiver,
    getTotalAmount,
    members,
    deleteMember,
    resetAllData,
  } = useStore();

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showWeekCompletion, setShowWeekCompletion] = useState(false);
  const currentReceiver = getCurrentReceiver();
  const totalAmount = getTotalAmount();
  const activeMembers = members.filter((m) => m.isActive);
  const completedWeeks = useStore((state) => state.completedWeeks);

  const handleMarkReceived = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    useStore.getState().markReceived(memberId, currentWeek);
    setShowWhatsApp(true);

    // Send email notification via API
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
            body: JSON.stringify({
              to: adminEmail,
              memberName: member.name,
              week: currentWeek,
              amount: totalAmount,
            }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const daysOfWeek = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const formatDateInput = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const tzOffset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - tzOffset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-700 border-red-200 dark:border-gray-600"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Panel Admin</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Kelola sistem arisan</p>
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full font-semibold">
          {activeMembers.length} Aktif
        </div>
      </div>

      <div className="space-y-4">
        {/* Tambah Anggota Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddMember(true)}
          className="w-full btn-secondary flex items-center justify-center gap-2 border-red-600 text-red-600 hover:bg-red-50 shadow-md"
          title="Tambah anggota baru ke dalam sistem arisan"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-semibold">Tambah Anggota Baru</span>
        </motion.button>
        {/* Set Minggu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Minggu Ke
          </label>
          <input
            type="number"
            min="1"
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 1, true)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all"
            title="Set minggu ke berapa arisan saat ini"
          />
        </div>

        {/* Set Jadwal Menabung */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Jadwal Menabung
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={savingsSchedule.dayOfWeek}
              onChange={(e) =>
                setSavingsSchedule(
                  parseInt(e.target.value),
                  savingsSchedule.time
                )
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
            >
              {daysOfWeek.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={savingsSchedule.time}
              onChange={(e) =>
                setSavingsSchedule(savingsSchedule.dayOfWeek, e.target.value)
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Hari & jam penarikan arisan.
          </p>
        </div>

        {/* Tanggal Mulai */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Tanggal Mulai Minggu ke-1
          </label>
          <input
            type="date"
            value={formatDateInput(savingsSchedule.startDate)}
            onChange={(e) => setSavingsStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Digunakan untuk menghitung tanggal setiap minggu. Ubah jika jadwal arisan dimulai dari tanggal tertentu.
          </p>
        </div>

        {/* Set Email Admin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Admin (Notifikasi)
          </label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="fikri.mobiliu@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
          />
        </div>

        {/* Mark Received Button */}
        {currentReceiver && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarkReceived(currentReceiver.id)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Tandai {currentReceiver.name} Sudah Menerima
          </motion.button>
        )}

        {/* Week Completion Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowWeekCompletion(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
            completedWeeks.includes(currentWeek)
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {completedWeeks.includes(currentWeek) 
            ? `Minggu ke-${currentWeek} Sudah Selesai` 
            : `Konfirmasi Minggu ke-${currentWeek} Selesai`}
        </motion.button>

        {/* WhatsApp Template */}
        {showWhatsApp && currentReceiver && (
          <WhatsAppTemplate
            memberName={currentReceiver.name}
            week={currentWeek}
            amount={totalAmount}
            onClose={() => setShowWhatsApp(false)}
          />
        )}

        {/* List Anggota untuk Hapus */}
        {activeMembers.length > 0 && (
          <div className="mt-6 pt-6 border-t border-red-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Kelola Anggota
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {member.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Yakin ingin menghapus ${member.name}? Data tabungan akan hilang.`
                        )
                      ) {
                        deleteMember(member.id);
                      }
                    }}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset All Data Button */}
        <div className="mt-6 pt-6 border-t border-red-300 dark:border-red-800">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                  Reset Semua Data
                </p>
                <p className="text-xs text-red-700 dark:text-red-400">
                  Tindakan ini akan menghapus semua history transaksi dan reset anggota ke default. 
                  <strong> Tindakan ini tidak dapat dibatalkan!</strong> Gallery dan settings (jadwal, email) akan tetap tersimpan.
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const confirmMessage = `PERINGATAN: Tindakan ini akan menghapus SEMUA data:\n\n` +
                `• Semua transaksi/history\n` +
                `• Semua anggota (reset ke default)\n` +
                `• Minggu ke-${currentWeek} (reset ke 1)\n` +
                `• Semua konfirmasi minggu selesai\n\n` +
                `Gallery dan settings (jadwal, email admin) akan tetap tersimpan.\n\n` +
                `YAKIN ingin melanjutkan? Ketik "RESET" untuk konfirmasi:`;
              
              const userInput = prompt(confirmMessage);
              
              if (userInput === "RESET") {
                if (confirm("Konfirmasi terakhir: YAKIN ingin menghapus semua data?")) {
                  resetAllData();
                  alert("Semua data telah direset. Halaman akan dimuat ulang...");
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              } else if (userInput !== null) {
                alert("Reset dibatalkan. Anda harus mengetik 'RESET' untuk konfirmasi.");
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset Semua Data</span>
          </motion.button>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
      />

      {/* Week Completion Modal */}
      <WeekCompletionModal
        isOpen={showWeekCompletion}
        onClose={() => setShowWeekCompletion(false)}
        week={currentWeek}
      />
    </motion.div>
  );
});

export default AdminPanel;

