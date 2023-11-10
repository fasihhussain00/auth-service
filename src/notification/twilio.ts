import twilio from "twilio";
import { TwilioConfig } from "../orm/entities/types";

class Twilio {
  private client: twilio.Twilio;

  constructor(config: TwilioConfig) {
    this.client = twilio(config.accountSid, config.authToken);
  }

  async sendSMS(to: string, from: string, body: string): Promise<void> {
    await this.client.messages.create({
      to,
      from,
      body,
    });
  }
}

export default Twilio;
