"use client";

import { motion } from "motion/react";
import { GoogleLogo, Sparkle, Brain, Compass, PencilCircle } from "@phosphor-icons/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
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

const hoverScale = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

export default function AuthPage() {
  const handleGoogleLogin = () => {
    // Backend will handle the Google OAuth flow and redirect back
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Hero Section - Bento Box 1 */}
        <motion.div
          variants={itemVariants}
          whileHover={hoverScale}
          className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-3xl bg-card border border-card-border p-8 md:p-12 flex flex-col justify-end cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            {/* Minimal pattern instead of heavy gradient */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary rounded-2xl">
                <Sparkle weight="fill" className="text-white h-8 w-8" />
              </div>
              <span className="text-2xl tracking-tight font-medium text-foreground">Echo.AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4 leading-tight">
              Personal AI Assistant
            </h1>
            <p className="text-xl text-muted font-light max-w-lg">
              Learn, Create, and Explore with an intelligent companion designed to simplify your everyday workflows.
            </p>
          </div>
        </motion.div>

        {/* Login Action - Bento Box 2 */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 md:row-span-2 rounded-3xl bg-card border border-card-border p-8 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-xs font-medium text-secondary tracking-widest uppercase">Ready</span>
          </div>
          <h2 className="text-2xl tracking-tight text-foreground mb-2 mt-4">Welcome Back</h2>
          <p className="text-muted text-sm mb-8 font-light">Sign in to sync your conversations and access your personalized workspace.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full max-w-sm flex items-center justify-center gap-3 bg-white text-zinc-900 py-4 px-6 rounded-2xl shadow-lg transition-colors hover:bg-zinc-100 cursor-pointer"
          >
            <GoogleLogo weight="bold" className="h-6 w-6 text-zinc-900" />
            <span className="text-base font-medium">Continue with Google</span>
          </motion.button>
          
          <p className="text-xs text-muted mt-8 font-light">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>

        {/* Feature 1 - Bento Box 3 */}
        <motion.div
          variants={itemVariants}
          whileHover={hoverScale}
          className="md:col-span-4 rounded-3xl bg-card border border-card-border p-6 flex flex-col gap-4 group cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Brain weight="duotone" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg text-foreground tracking-tight mb-1">Learn</h3>
            <p className="text-sm text-muted font-light">Expand your knowledge with intelligent, context-aware answers.</p>
          </div>
        </motion.div>

        {/* Feature 2 - Bento Box 4 */}
        <motion.div
          variants={itemVariants}
          whileHover={hoverScale}
          className="md:col-span-4 rounded-3xl bg-card border border-card-border p-6 flex flex-col gap-4 group cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <PencilCircle weight="duotone" className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg text-foreground tracking-tight mb-1">Create</h3>
            <p className="text-sm text-muted font-light">Generate ideas, draft content, and build faster than ever.</p>
          </div>
        </motion.div>

        {/* Feature 3 - Bento Box 5 */}
        <motion.div
          variants={itemVariants}
          whileHover={hoverScale}
          className="md:col-span-4 rounded-3xl bg-card border border-card-border p-6 flex flex-col gap-4 group cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center group-hover:bg-zinc-300 transition-colors">
            <Compass weight="duotone" className="h-6 w-6 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-lg text-foreground tracking-tight mb-1">Explore</h3>
            <p className="text-sm text-muted font-light">Navigate through complex topics with an intuitive AI guide.</p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
