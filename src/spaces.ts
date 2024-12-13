// import AWS from 'aws-sdk';
// import dotenv from 'dotenv';

// dotenv.config();

// const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);

// const s3 = new AWS.S3({
//   endpoint: spacesEndpoint,
//   accessKeyId: process.env.DO_SPACES_KEY,
//   secretAccessKey: process.env.DO_SPACES_SECRET,
// });

// export default s3;


import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const endpoint = process.env.DO_SPACES_ENDPOINT;
const accessKeyId = process.env.DO_SPACES_KEY;
const secretAccessKey = process.env.DO_SPACES_SECRET;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing required environment variables for S3Client");
}

// Initialize the S3 client
const s3 = new S3Client({
  endpoint,
  // region: "us-east-1", // Replace with your desired region
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3;


