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
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Traffic Kas</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Riwayat transaksi & grafik</p>
          </div>
        </div>
      </div>

      {/* Total Kas */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="mb-6 p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 opacity-90" />
          <p className="text-sm opacity-90 font-medium">Total Kas Saat Ini</p>
        </div>
        <p className="text-3xl font-bold">Rp {totalKas.toLocaleString("id-ID")}</p>
      </motion.div>

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
              Grafik Tabungan & Penerimaan
            </h3>
          </div>
          <div className="w-full overflow-x-auto -mx-2 px-2">
            <ResponsiveContainer width="100%" height={280} minWidth={300}>
              <BarChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                barCategoryGap="20%"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? "rgb(55 65 81)" : "#e5e7eb"}
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="week" 
                  tick={{ 
                    fontSize: 13, 
                    fill: isDark ? "rgb(209 213 219)" : "#4b5563",
                    fontWeight: 500
                  }}
                  axisLine={{ stroke: isDark ? "rgb(75 85 99)" : "#d1d5db" }}
                  tickLine={{ stroke: isDark ? "rgb(75 85 99)" : "#d1d5db" }}
                  label={{ 
                    value: "Minggu", 
                    position: "insideBottom", 
                    offset: -8,
                    fill: isDark ? "rgb(156 163 175)" : "#6b7280",
                    fontSize: 12,
                    fontWeight: 500
                  }}
                />
                <YAxis 
                  tick={{ 
                    fontSize: 12, 
                    fill: isDark ? "rgb(209 213 219)" : "#4b5563",
                    fontWeight: 500
                  }}
                  axisLine={{ stroke: isDark ? "rgb(75 85 99)" : "#d1d5db" }}
                  tickLine={{ stroke: isDark ? "rgb(75 85 99)" : "#d1d5db" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    ""
                  ]}
                  labelFormatter={(label) => `Minggu ke-${label}`}
                  contentStyle={{
                    backgroundColor: isDark ? "rgb(31 41 55)" : "white",
                    border: isDark ? "1px solid rgb(55 65 81)" : "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: isDark ? "rgb(243 244 246)" : "#1f2937",
                    boxShadow: isDark 
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3)" 
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                  itemStyle={{
                    padding: "4px 0",
                  }}
                  cursor={{ fill: isDark ? "rgba(55, 65, 81, 0.2)" : "rgba(229, 231, 235, 0.5)" }}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: "13px",
                    fontWeight: 500,
                    paddingTop: "16px",
                    paddingBottom: "8px",
                  }}
                  iconType="square"
                  formatter={(value) => (
                    <span style={{ 
                      color: isDark ? "rgb(209 213 219)" : "#4b5563",
                      marginLeft: "8px"
                    }}>
                      {value}
                    </span>
                  )}
                />
                <Bar 
                  dataKey="saving" 
                  fill="#10b981" 
                  name="Tabungan"
                  radius={[6, 6, 0, 0]}
                  strokeWidth={0}
                />
                <Bar 
                  dataKey="receiving" 
                  fill="#ef4444" 
                  name="Penerimaan"
                  radius={[6, 6, 0, 0]}
                  strokeWidth={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">
          Riwayat Transaksi Terbaru
        </h3>
        <div className="space-y-2.5">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {transaction.type === "saving" ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {transaction.memberName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {transaction.type === "saving" ? "Menabung" : "Menerima"} - Minggu ke-{transaction.week}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {format(new Date(transaction.date), "dd MMM yyyy HH:mm", {
                      locale: idLocale,
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada transaksi
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default KasTraffic;

