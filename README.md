# prebuild-utils

Helper functions for prebuilding lib dependencies used by Mimi Engine.

# AWS S3 Upload credentials
To use the AWS S3 upload functionality, you must define the following environment variables:

- `AWS_ACCESS_KEY_ID`  
  Your AWS access key ID, used for authentication.

- `AWS_SECRET_ACCESS_KEY`  
  Your AWS secret access key, used together with the access key ID.

- `AWS_REGION`  
  The AWS region where your S3 bucket is located (e.g., `us-west-2`).

- `AWS_S3_BUCKET`  
  The name of your S3 bucket where files will be uploaded.

- `AWS_S3_UPLOAD_ROOT`  
  The root path inside your S3 bucket under which files will be uploaded (e.g., `deps`).

These variables can be set in your shell environment. Otherwise, another way would be for your
project root (script) to read / load a local `.env` before executing the deploy step.

**Example `.env` file:**
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-2
AWS_S3_BUCKET=my-glfw-bucket
AWS_S3_UPLOAD_ROOT=mimi-prebuilt
```