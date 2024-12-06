import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT!);

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

export default s3;

