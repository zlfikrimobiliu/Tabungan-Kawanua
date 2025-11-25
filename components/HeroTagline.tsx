"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { useState, lazy, Suspense } from "react";

// Lazy load GalleryModal untuk optimasi performa
const GalleryModal = lazy(() => import("./GalleryModal"));

export default function HeroTagline() {
  const [showGallery, setShowGallery] = useState(false);
  const firstLine = "TORANG".split("");
  const secondLine = "PE TABUNGAN".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Title - TORANG PE TABUNGAN */}
        <div className="flex flex-col items-center gap-2 md:gap-3 mb-3">
          {/* First Line: TORANG */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {firstLine.map((letter, index) => (
              <motion.span
                key={`first-${index}`}
                variants={letterVariants}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
                className="inline-block text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent drop-shadow-lg"
                style={{
                  textShadow: "0 0 30px rgba(220, 38, 38, 0.4)",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Second Line: PE TABUNGAN */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {secondLine.map((letter, index) => (
              <motion.span
                key={`second-${index}`}
                variants={letterVariants}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
                className="inline-block text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent drop-shadow-lg"
                style={{
                  textShadow: "0 0 30px rgba(220, 38, 38, 0.4)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tagline - Sitou Timou Tumo Tou */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-6"
        >
          <motion.p
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="text-lg md:text-xl lg:text-2xl font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-red-800 bg-[length:200%_auto] text-center"
            style={{
              backgroundSize: "200% auto",
            }}
          >
            Sitou Timou Tumo Tou
          </motion.p>
        </motion.div>

        {/* Gallery Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Torang Pe Foto</span>
          </motion.button>
        </motion.div>

      </motion.div>

      {/* Gallery Modal - Lazy Loaded */}
      {showGallery && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <GalleryModal
            isOpen={showGallery}
            onClose={() => setShowGallery(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

