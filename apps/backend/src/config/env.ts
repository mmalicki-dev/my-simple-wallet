import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID || "",
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || "",
  EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY || "",
  EMAILJS_VERIFICATION_TEMPLATE_ID:
    process.env.EMAILJS_VERIFICATION_TEMPLATE_ID || "",
  EMAILJS_RESET_TEMPLATE_ID: process.env.EMAILJS_RESET_TEMPLATE_ID || "",
};

const missing = (
  [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "EMAILJS_SERVICE_ID",
    "EMAILJS_PUBLIC_KEY",
    "EMAILJS_PRIVATE_KEY",
  ] as const
).filter((key) => !env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

export default env;
