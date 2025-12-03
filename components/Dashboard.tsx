"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import StatsCard from "./StatsCard";
import MembersList from "./MembersList";
import KasTraffic from "./KasTraffic";
import AdminPanel from "./AdminPanel";
import { Shield, Users, Wallet, TrendingUp, Info, PiggyBank } from "lucide-react";
import HeroTagline from "./HeroTagline";
import AdminLoginModal from "./AdminLoginModal";
import AdminLogoutModal from "./AdminLogoutModal";
import DarkModeToggle from "./DarkModeToggle";
import { memo, useState } from "react";

const Dashboard = memo(function Dashboard() {
  const { getTotalKas, getTotalTabungan, isAdmin, setIsAdmin, members } = useStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const totalKas = getTotalKas();
  const totalTabungan = getTotalTabungan();
  const currentReceiver = useStore((state) => state.getCurrentReceiver());
  const nextReceiver = useStore((state) => state.getNextReceiver());
  const currentWeek = useStore((state) => state.currentWeek);
  const activeMembersCount = members.filter((m) => m.isActive).length;

  const stats = [
    {
      title: "Total Kas",
      value: `Rp ${totalKas.toLocaleString("id-ID")}`,
      icon: Wallet,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Tabungan",
      value: `Rp ${totalTabungan.toLocaleString("id-ID")}`,
      icon: PiggyBank,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Minggu Ke",
      value: currentWeek.toString(),
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Penerima Minggu Ini",
      value: currentReceiver?.name || "-",
      icon: Users,
      color: "from-red-600 to-red-700",
    },
    {
      title: "Penerima Minggu Depan",
      value: nextReceiver?.name || "-",
      icon: Shield,
      color: "from-red-700 to-red-800",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section with Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 md:mb-12"
      >
        {/* Top Bar - Dark Mode Toggle (Left) & Login Button (Right) */}
        <div className="flex items-center justify-between mb-4">
          {/* Dark Mode Toggle - Left */}
          <DarkModeToggle />
          
          {/* Login Button - Right */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isAdmin) {
                // Jika sudah admin, tampilkan logout modal
                setShowLogoutModal(true);
              } else {
                // Jika belum admin, tampilkan login modal
                setShowLoginModal(true);
              }
            }}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              isAdmin
                ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-lg shadow-red-500/30"
                : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-md hover:shadow-lg"
            }`}
            title={isAdmin ? "Keluar dari mode admin" : "Login sebagai admin"}
          >
            {isAdmin ? (
              <>
                <Shield className="w-4 h-4" /><motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Admin</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                />
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Login</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Hero Tagline */}
        <div className="mb-6 md:mb-8">
          <HeroTagline />
        </div>

        {/* Subtitle Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-4">
            Sistem Arisan Digital - <span className="font-semibold text-red-600 dark:text-red-400">{activeMembersCount} Anggota Aktif</span>
          </p>
          
          {/* Rekening Info Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="inline-block p-4 md:p-5 bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-red-200 dark:border-gray-600 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Info className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-xs md:text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                Info Rekening
              </p>
            </div>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium">
              <span className="font-semibold">BCA:</span> 6115876019
            </p>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium">
              <span className="font-semibold">A/N:</span> FIKRI MOBILIU
            </p>
          </motion.div>
        </motion.div>
      </motion.div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <MembersList />
        </div>

        {/* Sidebar - Admin Panel & Traffic */}
        <div className="space-y-6">
          {isAdmin && <AdminPanel />}
          <KasTraffic />
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setShowLoginModal(false);
        }}
      />

      {/* Admin Logout Modal */}
      <AdminLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setIsAdmin(false);
          setShowLogoutModal(false);
        }}
      />
    </div>
  );
});

export default Dashboard;

