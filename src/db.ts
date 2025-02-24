import { DataSource } from "typeorm";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Attendance_Attendance } from "./Entities/attendance"; 
dotenv.config();

// Resolve the path to the CA certificate
const caCertificatePath = path.resolve(__dirname, "../ca-certificate.crt");

let caCert;
try {
  caCert = fs.readFileSync(caCertificatePath, "utf8");
} catch (error: any) {
  console.error("Error reading CA certificate:", error.message);
  process.exit(1);
}

// TypeORM DataSource setup
export const dataSource = new DataSource({
  type: "postgres", // Assuming you are using PostgreSQL
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
  entities: [Attendance_Attendance], // Register your entity here
  synchronize: true, // Automatically sync the schema to the database
  logging: process.env.DB_LOGGING === "true", // Optional logging based on env
  migrations: [], // You can set up migrations if needed in the future
  subscribers: [],
});

// Test the TypeORM connection
(async () => {
  try {
    await dataSource.initialize();
    console.log("Database connection successful.");
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
})();
