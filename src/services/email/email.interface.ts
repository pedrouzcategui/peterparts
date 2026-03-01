// Email Service Interface - Clean Architecture Pattern
// Implement this interface to add a new email provider (e.g., SendGrid, Mailgun, etc.)

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export interface IEmailProvider {
  send(options: SendEmailOptions): Promise<SendEmailResult>;
}

// OTP-specific email options
export type SendOtpEmailOptions = {
  to: string;
  code: string;
  expiresInMinutes: number;
};
