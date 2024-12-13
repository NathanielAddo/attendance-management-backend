// // import pkg from 'pg';
// // import { readFile } from 'fs/promises';
// // import dotenv from 'dotenv';
// // import fs from "fs";
// // import path from "path";


// // const caCertificatePath = path.resolve(__dirname, "../ca-certificate.crt"); // Resolves the absolute path
// // const caCertificate = fs.readFileSync(caCertificatePath).toString();


// // dotenv.config();

// // const { Pool } = pkg;

// // // Database connection setup
// // export const pool = new Pool({
// //   connectionString: process.env.DATABASE_URL, // Store the connection string in the environment variable
// //   ssl: {
// //     rejectUnauthorized: true,
// //     ca: caCertificate,
// // },
// // });

// // // Drop tables if they exist, ensuring correct order
// // (async () => {
// //   try {
// //     // Define the correct order of dropping tables
// //     const dropTableQueries = [
// //       'DROP TABLE IF EXISTS notification_logs',   // No foreign key dependency
// //       'DROP TABLE IF EXISTS notifications_v2',   // No foreign key dependency
// //       'DROP TABLE IF EXISTS notification_templates_v2', // No foreign key dependency
// //       'DROP TABLE IF EXISTS notification_templates', // No foreign key dependency
// //       'DROP TABLE IF EXISTS notifications', // Can be dropped after templates
// //       'DROP TABLE IF EXISTS biometric_data', // Can be dropped at any point
// //       'DROP TABLE IF EXISTS device_requests', // Can be dropped at any point
// //       'DROP TABLE IF EXISTS locations', // Can be dropped at any point
// //       'DROP TABLE IF EXISTS events', // Can be dropped at any point
// //       'DROP TABLE IF EXISTS roster', // Can be dropped at any point
// //       'DROP TABLE IF EXISTS attendance', // Drop after other dependent tables
// //       'DROP TABLE IF EXISTS schedules', // Drop last as it is referenced by attendance
// //       'DROP TABLE IF EXISTS users', // Can be dropped at any point
// //     ];

// //     for (const query of dropTableQueries) {
// //       try {
// //         await pool.query(query);
// //         console.log(`Table dropped successfully: ${query}`);
// //       } catch (dropError) {
// //         // Ensure dropError is of a specific type
// //         if (dropError instanceof Error) {
// //           // If the error is related to a missing table (42P01), log and continue
// //           const pgError = dropError as any; // Explicit cast to handle PostgreSQL-specific errors
// //           if (pgError.code === '42P01') {
// //             console.log(`Table does not exist, skipping: ${query}`);
// //           } else {
// //             console.error(`Error dropping table: ${dropError.message}`);
// //           }
// //         } else {
// //           console.error('Unexpected error:', dropError);
// //         }
// //       }
// //     }

// //     // Apply the updated schema (after dropping tables)
// //     const schema = await readFile('schema.sql', 'utf8'); // Ensure the updated schema file name
// //     await pool.query(schema);
// //     console.log('Updated schema applied successfully');
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // })();

// import pkg from "pg";
// import { readFile } from "fs/promises";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";

// const caCertificatePath = path.resolve(__dirname, "../ca-certificate.crt"); // Resolves the absolute path
// const caCertificate = fs.readFileSync(caCertificatePath).toString();

// dotenv.config();

// const { Pool } = pkg;

// // Database connection setup
// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Store the connection string in the environment variable
//   ssl: {
//     rejectUnauthorized: true,
//     ca: caCertificate,
//   },
// });

// // Test the database connection
// (async () => {
//   try {
//     const client = await pool.connect();
//     console.log("Database connection successful.");
//     client.release(); // Release the client back to the pool
//   } catch (error:any) {
//     console.error("Database connection failed:", error.message);
//     process.exit(1); // Exit the process if the connection fails
//   }
// })();

// // Drop tables if they exist, ensuring correct order
// (async () => {
//   try {
//     // Define the correct order of dropping tables
//     const dropTableQueries = [
//       "DROP TABLE IF EXISTS notification_logs", // No foreign key dependency
//       "DROP TABLE IF EXISTS notifications_v2", // No foreign key dependency
//       "DROP TABLE IF EXISTS notification_templates_v2", // No foreign key dependency
//       "DROP TABLE IF EXISTS notification_templates", // No foreign key dependency
//       "DROP TABLE IF EXISTS notifications", // Can be dropped after templates
//       "DROP TABLE IF EXISTS biometric_data", // Can be dropped at any point
//       "DROP TABLE IF EXISTS device_requests", // Can be dropped at any point
//       "DROP TABLE IF EXISTS locations", // Can be dropped at any point
//       "DROP TABLE IF EXISTS events", // Can be dropped at any point
//       "DROP TABLE IF EXISTS roster", // Can be dropped at any point
//       "DROP TABLE IF EXISTS attendance", // Drop after other dependent tables
//       "DROP TABLE IF EXISTS schedules", // Drop last as it is referenced by attendance
//       "DROP TABLE IF EXISTS users", // Can be dropped at any point
//     ];

//     for (const query of dropTableQueries) {
//       try {
//         await pool.query(query);
//         console.log(`Table dropped successfully: ${query}`);
//       } catch (dropError) {
//         // Ensure dropError is of a specific type
//         if (dropError instanceof Error) {
//           // If the error is related to a missing table (42P01), log and continue
//           const pgError = dropError as any; // Explicit cast to handle PostgreSQL-specific errors
//           if (pgError.code === "42P01") {
//             console.log(`Table does not exist, skipping: ${query}`);
//           } else {
//             console.error(`Error dropping table: ${dropError.message}`);
//           }
//         } else {
//           console.error("Unexpected error:", dropError);
//         }
//       }
//     }

//     const sqlPath = path.resolve(__dirname, "schema.sql"); // Resolves the absolute path
// // const caCertificate = fs.readFileSync(caCertificatePath).toString();

//     // Apply the updated schema (after dropping tables)
//     const schema = await readFile(sqlPath, "utf8"); // Ensure the updated schema file name
//     await pool.query(schema);
//     console.log("Updated schema applied successfully");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();

import pkg from "pg";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const caCertificatePath = path.resolve(__dirname, "../ca-certificate.crt"); // Resolves the absolute path
const caCertificate = fs.readFileSync(caCertificatePath).toString();

dotenv.config();

const { Pool } = pkg;

// Database connection setup
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Store the connection string in the environment variable
  ssl: {
    rejectUnauthorized: true,
    ca: caCertificate,
  },
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("Database connection successful.");
    client.release(); // Release the client back to the pool
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
})();

// Apply the schema from schema.sql
(async () => {
  try {
    const sqlPath = path.resolve(__dirname, "schema.sql"); // Resolves the absolute path
    const schema = await readFile(sqlPath, "utf8"); // Read the schema.sql file
    await pool.query(schema); // Execute the schema.sql contents
    console.log("Schema applied successfully.");
  } catch (error:any) {
    console.error("Error applying schema:", error.message);
  }
})();
