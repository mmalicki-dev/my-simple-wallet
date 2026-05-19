import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";

import "./config/passport.js";
import env from "./config/env.js";

import routes from "./api/routes/index.js";
import docRoutes from "./docs/docRoutes.js";

import {
  globalLimiter,
  authLimiter,
} from "./api/middlewares/rateLimitMiddleware.js";

import { errorHandler } from "./api/middlewares/errorMiddleware.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/refresh", authLimiter);
app.use("/api", globalLimiter);

app.use("/api", routes);
app.use("/api/docs", docRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
