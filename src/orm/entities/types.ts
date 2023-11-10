export enum AuthType {
  JWT = "jwt",
  AZUREAD = "azuread",
  GOOGLE = "google",
  APPLE = "apple",
}
export enum NotificationType {
  Twilio = "twilio",
  SendGrid = "sendgrid",
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  service: string;
  sendgridApiKey: string;
  sendgridEmail: string;
}

export interface SendGridConfig {
  apiKey: string;
  email: string;
}

export type NotificationConfig = TwilioConfig | SendGridConfig;

export interface JwtAuthConfig {
  privateKey: string;
  publicKey: string;
}

export interface AzureADAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
}

export interface AppleAuthConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}

export type AuthConfig =
  | JwtAuthConfig
  | AzureADAuthConfig
  | GoogleAuthConfig
  | AppleAuthConfig;
