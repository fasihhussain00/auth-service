import appConfig from "../configs/app";
import { AppleAuthConfig } from "../orm/entities/types";
import jwt from "jsonwebtoken";
export class AppleSSOAuth {
  constructor(private config: AppleAuthConfig) {}

  public getLoginUrl(state: string): string {
    const authorizationEndpoint = "https://appleid.apple.com/auth/authorize";
    const params = new URLSearchParams();
    params.append("response_type", "code id_token");
    params.append("response_mode", "form_post");
    params.append("client_id", this.config.clientId);
    params.append(
      "redirect_uri",
      `${appConfig.baseUrl}/api/auth/apple/callback`
    );
    params.append("state", state);
    params.append("scope", "name email");
    return `${authorizationEndpoint}?${params.toString()}`;
  }
  private generateClientSecret(exp: number) {
    const claims = {
      iss: this.config.teamId,
      iat: Math.floor(Date.now() / 1000),
      exp,
      aud: "https://appleid.apple.com",
      sub: this.config.clientId,
    };
    return jwt.sign(claims, this.config.privateKey, {
      algorithm: "ES256",
      keyid: this.config.keyId,
    });
  }
  public async getToken(code: string): Promise<any> {
    const tokenEndpoint = "https://appleid.apple.com/auth/token";
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", this.config.clientId);
    params.append("client_secret", this.generateClientSecret(3600));
    params.append(
      "redirect_uri",
      `${appConfig.baseUrl}/api/auth/apple/callback`
    );
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const data = await response.json();
    if (data.error) {
      return null;
    }
    return data;
  }

  public async getUserInfo(token: string): Promise<any> {
    const userInfoEndpoint = "https://appleid.apple.com/auth/userinfo";
    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      return null;
    }
    return data;
  }
}
