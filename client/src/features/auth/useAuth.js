"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser, logoutUser } from "./auth.api";
import { setUser, clearUser, setLoading } from "./authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const startTime = Date.now();
    try {
      const user = await fetchCurrentUser();
      dispatch(setUser(user));
    } catch (error) {
      dispatch(clearUser());
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsedTime < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
      }
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    checkAuth,
  };
}
