import path from "path";
import { get_platform_triplet, BuildConfig, print_build_config } from "./config.js";
import { log } from "./log.js";
import { generate_abi_from_config } from "./abi.js";
import { s3_putObjectFile, AWSUploadCredentials, AWSUploadOptions, AWSRegion } from "./aws.js";
import { get_bundle_path, get_bundle_filename } from "./bundle.js";

export type DeployConfig = {
    region: string;
};

/**
 * Gets the remote bucket path.
 * @param config - The configuration for the dependency.
 * @returns The remote bucket path.
 */
function get_remote_bucket_path(config: BuildConfig) {
    const { platform, name } = config;
    const abi = generate_abi_from_config(config);
    const triplet = get_platform_triplet(platform);
    const fileName = get_bundle_filename(abi, config);
    return path.join(`deps/${triplet}/${name}`, fileName);
}

/**
 * Deploys the dependency given a CMake preset name.
 * @param rootDir - The root directory of the repository.
 * @param config - The configuration for the dependency.
 */
export async function deploy_dependency(rootDir: string, config: BuildConfig) {
    print_build_config(config);

    try {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
            throw new Error("AWS credentials not set");
        }

        const awsUploadCredentials: AWSUploadCredentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };

        const awsUploadOptions: AWSUploadOptions = {
            cacheControl: "public, max-age=31536000, immutable",
            region: process.env.AWS_REGION as AWSRegion,
            credentials: awsUploadCredentials,
        };

        const localBundlePath = get_bundle_path(rootDir, config);
        const remoteBucketPath = get_remote_bucket_path(config);
        await s3_putObjectFile("gg.mimi", remoteBucketPath, localBundlePath, awsUploadOptions);

        log.ok(`Deployed to ${remoteBucketPath}`);
    } catch (error) {
        log.err(`Failed to deploy ${config.name}(${config.version})`);
        throw error;
    }
}