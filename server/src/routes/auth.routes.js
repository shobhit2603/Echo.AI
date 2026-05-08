import { Router } from "express";
import passport from "passport";
import {
  googleAuthController,
  getCurrentUser,
  logoutController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  googleAuthController,
);

authRouter.get("/user", authMiddleware, getCurrentUser);

authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
