import { AppDataSource } from "../ormconfig";

(async () => {
  await AppDataSource.initialize();
  if (!AppDataSource.isInitialized) {
    throw new Error("cannot connect to the database");
  }
  // await RoleSeeder.seed();
})();
