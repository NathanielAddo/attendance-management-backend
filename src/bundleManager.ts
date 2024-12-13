import { gzip } from "zlib";
import { promisify } from "util";
import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import s3 from "./spaces";
import { pool } from "./db";

const gzipAsync = promisify(gzip);

export async function createAndUploadBundle(
  queryName: string,
  query: string,
  params: any[] = []
) {
  try {
    // Execute query
    const result = await pool.query(query, params);

    // Format result as JSON
    const jsonResult = JSON.stringify(result.rows);

    // Compress the JSON
    const compressedResult = await gzipAsync(jsonResult);

    // Generate a unique name for the bundle
    const bundleName = `${queryName}_${Date.now()}.json.gz`;

    // Upload to DigitalOcean Spaces using PutObjectCommand
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: bundleName,
      Body: compressedResult,
      ContentType: "application/json",
      ContentEncoding: "gzip",
      ACL: "public-read",
    });

    await s3.send(command);

    // Generate public URL
    const publicUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${bundleName}`;

    return { bundleName, publicUrl };
  } catch (error) {
    console.error("Error creating and uploading bundle:", error);
    throw error;
  }
}

export async function getBundleUrl(bundleName: string): Promise<string | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: bundleName,
    });

    await s3.send(command);

    return `${process.env.DO_SPACES_CDN_ENDPOINT}/${bundleName}`;
  } catch (error) {
    return null; // Return null if the object does not exist
  }
}

export async function deleteBundle(bundleName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: bundleName,
    });

    await s3.send(command);
  } catch (error) {
    console.error("Error deleting bundle:", error);
    throw error;
  }
}
