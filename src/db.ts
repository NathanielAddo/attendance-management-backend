import pkg from "pg";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const { Pool } = pkg;

// Resolve the path to the CA certificate
const caCertificatePath = path.resolve(__dirname, "../ca-certificate.crt");

let caCert;
try {
  caCert = fs.readFileSync(caCertificatePath, "utf8");
} catch (error:any) {
  console.error("Error reading CA certificate:", error.message);
  process.exit(1);
}

// Database connection setup
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
  max: 10, // Limit the maximum number of connections
  idleTimeoutMillis: 30000, // Time before idle connections are closed
  // logging: process.env.DB_LOGGING === "true", // Conditional logging based on env
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("Database connection successful.");
    client.release();
  } catch (error:any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
})();

// Apply the schema from schema.sql
(async () => {
  const sqlPath = path.resolve(__dirname, "schema.sql");
  try {
    const schema = await readFile(sqlPath, "utf8");
    await pool.query(schema);
    console.log("Schema applied successfully.");
  } catch (error:any) {
    console.error("Error applying schema:", error.message);
  }
})();
