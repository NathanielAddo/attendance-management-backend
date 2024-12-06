import { S3 } from 'aws-sdk';
import s3 from './spaces';

export async function logSpacesUsage() {
  try {
    const data = await s3.listObjectsV2({ Bucket: process.env.DO_SPACES_BUCKET! }).promise();
    const totalSize = data.Contents?.reduce((acc, obj) => acc + (obj.Size || 0), 0) || 0;
    const objectCount = data.KeyCount || 0;

    console.log(`Total storage used: ${totalSize} bytes`);
    console.log(`Total object count: ${objectCount}`);
  } catch (error) {
    console.error('Error logging Spaces usage:', error);
  }
}

// Call this function periodically or on-demand to log usage

