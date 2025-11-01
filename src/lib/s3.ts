import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import { log } from "./log";

export async function putObjectFile(
  bucket: string,
  key: string,
  filePath: string,
  opts: { cacheControl?: string, contentType?: string, region?: string, accessKeyId?: string, secretAccessKey?: string } = {}
) {
  const Body = fs.createReadStream(filePath);

  try {
    const client = new S3Client({
      region: opts.region,
      credentials: opts.accessKeyId && opts.secretAccessKey
        ? { accessKeyId: opts.accessKeyId, secretAccessKey: opts.secretAccessKey }
        : undefined,
    });
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body,
        ContentType: opts.contentType,
        CacheControl: opts.cacheControl,
      })
    );
    log.ok(`Uploaded s3://${bucket}/${key}`);
  }
  catch (error) {
    log.err(`Failed to upload s3://${bucket}/${key}`);
    throw error;
  }
}