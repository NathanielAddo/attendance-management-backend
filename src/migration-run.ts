// src/migration-run.ts
import { dataSource } from "./db";

dataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    await dataSource.runMigrations();
    console.log("Migrations have been run successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
    process.exit(1);
  });
