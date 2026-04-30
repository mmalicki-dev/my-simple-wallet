import { createEmailService } from "email/src/index.js";
import env from "./env.js";

const emailService = createEmailService({
  serviceId: env.EMAILJS_SERVICE_ID,
  publicKey: env.EMAILJS_PUBLIC_KEY,
  privateKey: env.EMAILJS_PRIVATE_KEY,
});

export const sendVerificationEmail = (
  to: string,
  name: string,
  token: string,
) =>
  emailService.sendVerificationEmail({
    to,
    name,
    description: `Happy to have you onboard, ${name}. Your account is almost ready.`,
    verificationUrl: `${env.CLIENT_URL}/verify-email?token=${token}`,
    appName: "My Simple Wallet",
    templateId: env.EMAILJS_VERIFICATION_TEMPLATE_ID,
  });

export const sendChangeEmailVerification = (
  to: string,
  name: string,
  token: string,
) =>
  emailService.sendVerificationEmail({
    to,
    name,
    description: `We received a request to change the email address on your My Simple Wallet account.`,
    verificationUrl: `${env.CLIENT_URL}/confirm-email-change?token=${token}`,
    appName: "My Simple Wallet",
    templateId: env.EMAILJS_VERIFICATION_TEMPLATE_ID,
  });

export const sendPasswordResetEmail = (
  to: string,
  name: string,
  token: string,
) =>
  emailService.sendPasswordResetEmail({
    to,
    name,
    resetUrl: `${env.CLIENT_URL}/reset-password?token=${token}`,
    appName: "My Simple Wallet",
    templateId: env.EMAILJS_RESET_TEMPLATE_ID,
  });
