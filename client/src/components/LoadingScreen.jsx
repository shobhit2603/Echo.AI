"use client";

import { motion } from "motion/react";
import { Sparkle } from "@phosphor-icons/react";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkle weight="fill" className="text-white h-12 w-12" />
          </motion.div>
        </motion.div>
        
        <div className="flex flex-col items-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-medium tracking-tight text-foreground"
          >
            Welcome to Echo.AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted text-sm"
          >
            Initializing your personal workspace...
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "12rem" }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
          className="h-1 rounded-full bg-primary/20 overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.6, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
}
