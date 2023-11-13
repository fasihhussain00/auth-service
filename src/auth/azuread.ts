import * as msal from "@azure/msal-node";
import { AzureADAuthConfig } from "../orm/entities/types";
import appConfig from "../configs/app";

export class AzureADSSOAuth {
  private readonly msalClient: msal.ConfidentialClientApplication;
  private readonly redirectUri: string;

  constructor(config: AzureADAuthConfig) {
    const msalConfig: msal.Configuration = {
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        clientSecret: config.clientSecret,
      },
    };
    this.msalClient = new msal.ConfidentialClientApplication(msalConfig);
    this.redirectUri = `${appConfig.baseUrl}/api/auth/microsoft/callback`;
  }

  async getLoginUrl(state: string, failureUri: string) {
    const authCodeUrlParameters: msal.AuthorizationUrlRequest = {
      redirectUri: this.redirectUri,
      scopes: ["user.read"],
      state,
      prompt: "select_account",
      responseMode: "query",
    };
    try {
      const response = await this.msalClient.getAuthCodeUrl(
        authCodeUrlParameters
      );
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getToken(authCode: string) {
    const tokenRequest: msal.AuthorizationCodeRequest = {
      code: authCode,
      redirectUri: this.redirectUri,
      scopes: ["user.read"],
    };

    try {
      const tokenResponse = await this.msalClient.acquireTokenByCode(
        tokenRequest
      );
      return tokenResponse;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getUserInfo(tokenResult: msal.AuthenticationResult) {
    const account = tokenResult.account;
    if (!account) {
      return null;
    }
    return {
      name: account.name,
      email: account.username,
      id: account.idTokenClaims.oid,
    };
  }
}
