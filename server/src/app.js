import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import config from "./config/config.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Trust reverse proxy (Railway) for secure cookies
app.set("trust proxy", 1);

// Apply HTTP security headers
app.use(helmet());

app.use(morgan("dev"));

// Strip trailing slash from CLIENT_URL for exact CORS matching
const clientUrl = config.CLIENT_URL ? config.CLIENT_URL.replace(/\/$/, "") : "";

app.use(cors({
  origin: clientUrl,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Echo.AI backend is running...");
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        profilePicture: profile.photos?.[0]?.value,
      };
      return done(null, user);
    },
  ),
);

// Apply general API rate limiter
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/chat", chatRouter);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
