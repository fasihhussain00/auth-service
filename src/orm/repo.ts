import { Account } from "./entities/account";
import { App } from "./entities/app";
import { Auth } from "./entities/auth";
import { User } from "./entities/user";
import { AppDataSource } from "./ormconfig";

export const accountRepo = AppDataSource.getRepository(Account);
export const appRepo = AppDataSource.getRepository(App);
export const authRepo = AppDataSource.getRepository(Auth);
export const userRepo = AppDataSource.getRepository(User);
