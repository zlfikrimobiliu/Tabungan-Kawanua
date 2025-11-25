"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { memo } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  tooltip?: string;
}

const StatsCard = memo(function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  tooltip 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-shadow duration-300"
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1.5 font-medium">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">{value}</p>
        </div>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg flex-shrink-0`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
});

export default StatsCard;

