import emailjs from "@emailjs/nodejs";

export interface EmailConfig {
  serviceId: string;
  publicKey: string;
  privateKey: string;
}

export interface VerificationEmailParams {
  to: string;
  name: string;
  description: string;
  verificationUrl: string;
  appName: string;
  templateId: string;
}

export interface PasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
  appName: string;
  templateId: string;
}

export function createEmailService(config: EmailConfig) {
  const send = (templateId: string, variables: Record<string, string>) => {
    return emailjs.send(config.serviceId, templateId, variables, {
      publicKey: config.publicKey,
      privateKey: config.privateKey,
    });
  };

  return {
    sendVerificationEmail: (params: VerificationEmailParams) =>
      send(params.templateId, {
        to_email: params.to,
        name: params.name,
        description: params.description,
        verification_url: params.verificationUrl,
        app_name: params.appName,
      }),

    sendPasswordResetEmail: (params: PasswordResetEmailParams) =>
      send(params.templateId, {
        to_email: params.to,
        name: params.name,
        reset_url: params.resetUrl,
        app_name: params.appName,
      }),
  };
}
