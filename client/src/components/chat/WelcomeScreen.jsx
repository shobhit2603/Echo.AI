import React from 'react';
import { motion } from "motion/react";
import Spline from "@splinetool/react-spline";
import useAuth from "@/features/auth/useAuth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <div className="flex-1 relative flex flex-col items-center justify-start overflow-hidden pt-[5vh] sm:pt-[8vh] md:pt-[10vh]">
      {/* Text Content - Moved to Top Center, Reduced Size, and click-through */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-col items-center text-center px-4 pointer-events-none"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-2 flex flex-col items-center drop-shadow-sm"
        >
          <span className="text-xl sm:text-2xl md:text-3xl tracking-tight font-light text-foreground/70 mb-1">
            Welcome back,
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-medium bg-linear-to-r from-primary via-fuchsia-500 to-secondary bg-clip-text text-transparent drop-shadow-md pb-2 leading-[1.1]">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-muted font-light max-w-md drop-shadow-sm"
        >
          How can I assist you today? Let&apos;s build, learn, or explore something
          new together.
        </motion.p>
      </motion.div>

      {/* 3D Model Container - Fixed width to prevent WebGL resize lag */}
      <motion.div
        variants={itemVariants}
        className="absolute inset-0 z-10 pointer-events-auto overflow-hidden"
      >
        {/* 
          Using w-[100vw] and left-1/2 -translate-x-1/2 ensures the WebGL canvas 
          maintains a constant size when the sidebar opens/closes.
          This completely eliminates the WebGL resize lag.
        */}
        <div className="absolute top-[10%] sm:top-[15%] md:top-[25%] left-1/2 -translate-x-1/2 w-screen -bottom-20 flex items-end justify-center transform-gpu">
          <Spline
            scene="https://prod.spline.design/xs2Dml6OGh6O27TY/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
