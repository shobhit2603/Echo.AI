"use client";

import useAuth from "@/features/auth/useAuth";
import { motion } from "motion/react";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"
      >
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-linear-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome back, {user?.name || "User"}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-linear-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <button
            onClick={logout}
            className="pointer-events-auto flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex place-items-center mt-24"
      >
        <h1 className="text-4xl font-bold tracking-tight text-primary">Echo.AI Dashboard</h1>
      </motion.div>
    </main>
  );
}
