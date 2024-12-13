import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from "./spaces";

export async function logSpacesUsage() {
  try {
    // Create a ListObjectsV2Command
    const command = new ListObjectsV2Command({
      Bucket: process.env.DO_SPACES_BUCKET!,
    });

    // Send the command using the S3 client
    const data = await s3.send(command);

    // Calculate total size and object count
    const totalSize =
      data.Contents?.reduce((acc, obj) => acc + (obj.Size || 0), 0) || 0;
    const objectCount = data.Contents?.length || 0;

    console.log(`Total storage used: ${totalSize} bytes`);
    console.log(`Total object count: ${objectCount}`);
  } catch (error) {
    console.error("Error logging Spaces usage:", error);
  }
}

// Call this function periodically or on-demand to log usage
