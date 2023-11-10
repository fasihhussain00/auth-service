import { Request } from "express";
import { App } from "../orm/entities/app";
import { Account } from "../orm/entities/account";
import { User } from "../orm/entities/user";

export interface AccountAuthRequest extends Request {
  account: Account;
}

export interface AppAuthRequest extends Request {
  clientApp: App;
}

export interface JWTAuthRequest extends AppAuthRequest {
  user: User;
}