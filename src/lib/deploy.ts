import path from "path";
import { get_platform_triplet, BuildConfig, print_build_config } from "./config.js";
import { log } from "./log.js";
import { generate_abi_from_config, generate_abi_hash } from "./abi.js";
import { putObjectFile } from "./s3.js";

/**
 * Deploys the dependency given a CMake preset name.
 * @param rootDir - The root directory of the repository.
 * @param config - The configuration for the dependency.
 */
export async function deploy_dependency(rootDir: string, config: BuildConfig) {
    const { platform } = config;
    const triplet = get_platform_triplet(platform);

    log.info("Deploying dependency...");
    print_build_config(config);

    try {
        const abi = generate_abi_from_config(config);
        const hash = generate_abi_hash(abi);
        const bundleDir = path.join(rootDir, "bundles", triplet);
        const fileName = `${config.name}-${config.version}-${hash}.zip`;
        const archiveFile = path.join(bundleDir, `${config.name}-${config.version}-${hash}.zip`);

        const zipPath = path.resolve(`deps/${triplet}/${config.name}`, fileName);
        await putObjectFile("gg.mimi", archiveFile, zipPath, {
            cacheControl: "public, max-age=31536000, immutable",
            contentType: "application/zip",
            region: "us-east-1",
            accessKeyId: "AKIAIOSFODNN7EXAMPLE",
            secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        });

        log.ok(`Deployed ${config.name}(${config.version})`);
    } catch (error) {
        log.err(`Failed to deploy ${config.name}(${config.version})`);
        throw error;
    }
}