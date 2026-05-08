"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "./useAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function AuthProvider({ children }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if we have mounted, checked auth, and we aren't loading
    if (isMounted && !isLoading) {
      if (!isAuthenticated && pathname !== "/auth") {
        router.push("/auth");
      } else if (isAuthenticated && pathname === "/auth") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isMounted]);

  // To prevent hydration mismatch, avoid rendering children until mounted
  if (!isMounted) return null;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated and trying to access protected route, render loading while redirecting
  if (!isAuthenticated && pathname !== "/auth") {
    return <LoadingScreen />;
  }

  // If authenticated and trying to access auth route, render loading while redirecting
  if (isAuthenticated && pathname === "/auth") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
