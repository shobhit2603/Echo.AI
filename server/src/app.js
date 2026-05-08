import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import config from "./config/config.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({
  origin: config.CLIENT_URL,
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

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

export default app;
