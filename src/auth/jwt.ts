import jwt from "jsonwebtoken";
import fs from "fs";
import { JwtAuthConfig } from "../orm/entities/types";
import crypto from "crypto";
import appConfig from "../configs/app";

export interface IKeyPair {
  publicKey: string;
  privateKey: string;
}

class JwtAuth {
  private config: JwtAuthConfig;

  constructor(config: JwtAuthConfig) {
    this.config = config;
  }

  static generateKeyPair(): IKeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    return { publicKey, privateKey };
  }

  sign(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.config.privateKey, {
      expiresIn,
      algorithm: "RS256",
    });
  }
  static signWithAppKey(payload: any, expiresIn: string): string {
    return jwt.sign(payload, appConfig.jwtSecret, {
      expiresIn,
      algorithm: "HS256",
    });
  }

  verify(token: string): any {
    return jwt.verify(token, this.config.publicKey, { algorithms: ["RS256"] });
  }
}

export default JwtAuth;
