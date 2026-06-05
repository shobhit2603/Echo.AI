"use client";

import { motion } from "motion/react";
import { ShootingStarIcon } from "@phosphor-icons/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 22 },
  },
};

export default function LoadingScreen() {
  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden p-6">
      
      {/* Frameless Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[400px] flex flex-col items-center text-center px-4"
      >
        {/* Minimal Animated Loading Logo */}
        <motion.div variants={itemVariants} className="relative flex items-center justify-center mb-10">
          {/* Subtle Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-15px] rounded-full border border-dashed border-primary/30"
          />
          {/* Subtle Inner Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-25px] rounded-full border border-dotted border-primary/20"
          />
          {/* Core Logo Container */}
          <div className="p-4 bg-primary/10 rounded-2xl text-primary backdrop-blur-md relative overflow-hidden shadow-xl shadow-primary/5">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8] 
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShootingStarIcon weight="fill" className="h-8 w-8" />
            </motion.div>
          </div>
        </motion.div>

        {/* Header Text */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3 flex items-center justify-center gap-2">
            Echo.AI
          </h1>
          <p className="text-base text-muted-foreground font-light leading-relaxed">
            Initializing your personal workspace
          </p>
        </motion.div>

        {/* Minimal Progress Indicator */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-primary/80"
            />
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
