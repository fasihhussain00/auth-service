import { OAuth2Client } from "google-auth-library";
import { GoogleAuthConfig } from "../orm/entities/types";
import appConfig from "../configs/app";

export class GoogleSSOAuth {
  private client: OAuth2Client;

  constructor(config: GoogleAuthConfig) {
    this.client = new OAuth2Client(
      config.clientId,
      config.clientSecret,
      `${appConfig.baseUrl}/api/auth/google/callback`
    );
  }

  async getLoginUrl(state: string, failureUri: string): Promise<string> {
    const url = this.client.generateAuthUrl({
      prompt: "select_account",
      scope: ["profile", "email"],
      state,
      failureRedirect: failureUri,
    });
    return url;
  }

  async getToken(code: string) {
    const { tokens } = await this.client.getToken(code);
    return tokens;
  }

  async getUserInfo(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.client._clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  }
}
