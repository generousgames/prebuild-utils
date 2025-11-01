import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";
import mime from "mime"; // optional: npm i mime

export async function putObjectFile(
  bucket: string,
  key: string,
  filePath: string,
  opts: { cacheControl?: string, contentType?: string, region?: string, accessKeyId?: string, secretAccessKey?: string } = {}
) {
  const client = new S3Client({
    region: opts.region,
    credentials: opts.accessKeyId && opts.secretAccessKey
      ? { accessKeyId: opts.accessKeyId, secretAccessKey: opts.secretAccessKey }
      : undefined,
  });
  const Body = fs.createReadStream(filePath);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl,
      // ACL: "public-read", // NOT recommended; prefer a bucket policy if you need public access
    })
  );
  console.log(`✔ Uploaded s3://${bucket}/${key}`);
}