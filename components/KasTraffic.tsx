"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { TrendingUp, ArrowDownCircle, ArrowUpCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { memo, useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const KasTraffic = memo(function KasTraffic() {
  const { transactions, getTotalKas, darkMode } = useStore();
  const totalKas = getTotalKas();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(darkMode ?? document.documentElement.classList.contains("dark"));
    
    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [darkMode]);

  // Memoize chart data untuk performance
  const chartData = useMemo(() => {
    const weeklyData = transactions.reduce((acc, transaction) => {
      const week = transaction.week;
      if (!acc[week]) {
        acc[week] = { week, saving: 0, receiving: 0 };
      }
      if (transaction.type === "saving") {
        acc[week].saving += transaction.amount;
      } else {
        acc[week].receiving += transaction.amount;
      }
      return acc;
    }, {} as Record<number, { week: number; saving: number; receiving: number }>);

    return Object.values(weeklyData).sort((a, b) => a.week - b.week);
  }, [transactions]);

  // Memoize recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Traffic Kas</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Riwayat transaksi & grafik</p>
          </div>
        </div>
      </div>

      {/* Total Kas */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="mb-6 p-4 md:p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 opacity-90" />
          <p className="text-xs md:text-sm opacity-90 font-medium">Total Kas Saat Ini</p>
        </div>
        <p className="text-2xl md:text-3xl font-bold">Rp {totalKas.toLocaleString("id-ID")}</p>
      </motion.div>

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Grafik Tabungan & Penerimaan
          </h3>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={200} minWidth={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="dark:text-gray-300"
                  label={{ value: "Minggu", position: "insideBottom", offset: -5 }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="dark:text-gray-300"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `Rp ${value.toLocaleString("id-ID")}`
                  }
                  contentStyle={{
                    backgroundColor: isDark ? "rgb(31 41 55)" : "white",
                    border: isDark ? "1px solid rgb(55 65 81)" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                    color: isDark ? "rgb(243 244 246)" : "#1f2937",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar 
                  dataKey="saving" 
                  fill="#10b981" 
                  name="Tabungan"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="receiving" 
                  fill="#ef4444" 
                  name="Penerimaan"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Riwayat Transaksi Terbaru
          </h3>
        <div className="space-y-2">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {transaction.type === "saving" ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {transaction.memberName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {transaction.type === "saving" ? "Menabung" : "Menerima"} - Minggu ke-{transaction.week}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      transaction.type === "saving"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "saving" ? "+" : "-"}
                    Rp {transaction.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(transaction.date), "EEEE, dd MMM yyyy HH:mm", {
                      locale: idLocale,
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Belum ada transaksi
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default KasTraffic;

