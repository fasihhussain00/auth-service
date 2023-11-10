import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dbconfig from "../configs/db";
import appConfig from "../configs/app";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbconfig.host,
  port: dbconfig.port,
  username: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  entities: [__dirname + "/entities/**/*.{js,ts}"],
  migrations: [__dirname + "/migrations/**/*.{js,ts}"],
  logging: appConfig.debug,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: "migrations",
  namingStrategy: new SnakeNamingStrategy(),
  applicationName: "auth-service",
  dropSchema: false,
  useUTC: true,
});
