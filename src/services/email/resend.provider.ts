import { Resend } from "resend";
import type {
  IEmailProvider,
  SendEmailOptions,
  SendEmailResult,
} from "./email.interface.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@peterparts.com";

export class ResendEmailProvider implements IEmailProvider {
  private client: Resend;
  private fromEmail: string;

  constructor() {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    this.client = new Resend(RESEND_API_KEY);
    this.fromEmail = RESEND_FROM_EMAIL;
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const emailPayload = {
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        ...(options.text && { text: options.text }),
      };

      const result = await this.client.emails.send(emailPayload);

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error sending email",
      };
    }
  }
}
