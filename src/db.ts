// src/data-source.ts
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Attendance_Attendance } from "./Entities/attendance";
import { Location } from "./Entities/location";
import { AttendanceRecord } from "./Entities/attendanceRecord"; // new entity
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

export const dataSource = new DataSource({
  type: "postgres", // Using PostgreSQL
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
  entities: [Attendance_Attendance, AttendanceRecord, Location], // Register your entities here
  synchronize: true, // Automatically sync schema (disable in production)
  logging: process.env.DB_LOGGING === "true",
  // Look for migration files in the migrations folder (both .ts and .js)
  migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
  subscribers: [],
});

// Allow direct run for testing the connection (optional)
if (require.main === module) {
  (async () => {
    try {
      await dataSource.initialize();
      console.log("Database connection successful.");
      process.exit(0);
    } catch (error: any) {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    }
  })();
}
