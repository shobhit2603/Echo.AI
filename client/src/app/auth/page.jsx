"use client";

import { motion } from "motion/react";
import { GoogleLogoIcon, ShootingStarIcon } from "@phosphor-icons/react";

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

export default function AuthPage() {
  const handleGoogleLogin = () => {
    const API_URL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden p-6">
      {/* Frameless Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[400px] flex flex-col items-center text-center px-4"
      >
        {/* Brand App Logo */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2.5 mb-10"
        >
          <div className="p-2 bg-primary/10 rounded-xl text-primary backdrop-blur-md">
            <ShootingStarIcon weight="fill" className="h-5 w-5" />
          </div>
          <span className="text-lg tracking-wider font-semibold text-foreground uppercase">
            Echo.AI
          </span>
        </motion.div>

        {/* Header Text */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3">
            Welcome back
          </h1>
          <p className="text-base text-muted-foreground font-light leading-relaxed max-w-[320px] mx-auto">
            Sign in to step back into your intelligent workspace.
          </p>
        </motion.div>

        {/* Interactive Action Button */}
        <motion.div variants={itemVariants} className="w-full mb-10">
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-medium py-4 px-6 rounded-2xl shadow-xl shadow-foreground/5 transition-all hover:opacity-95 cursor-pointer text-sm tracking-wide"
          >
            <GoogleLogoIcon weight="bold" className="h-5 w-5" />
            <span>Continue with Google</span>
          </motion.button>
        </motion.div>

        {/* Subtle Bottom Links */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-muted-foreground/50 tracking-normal leading-normal max-w-[280px]"
        >
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          .
        </motion.p>
      </motion.div>
    </main>
  );
}
