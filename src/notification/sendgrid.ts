import sgMail from "@sendgrid/mail";
import { SendGridConfig } from "../orm/entities/types";

class SendGrid {
  private email: string;

  constructor(config: SendGridConfig) {
    this.email = config.email;
    sgMail.setApiKey(config.apiKey);
  }

  async sendEmail(
    to: string,
    templateId: string,
    dynamicTemplateData: any = {}
  ): Promise<boolean> {
    const msg = {
      to,
      from: this.email,
      templateId,
      dynamicTemplateData,
    };
    try {
      const response = await sgMail.send(msg);
      return response[0].statusCode === 202;
    } catch (error) {
      return false;
    }
  }
}

export default SendGrid;
