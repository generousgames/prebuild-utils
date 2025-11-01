import { BuildConfig } from "./config";

export function generate_manifest(config: BuildConfig, hash: string) {
    return {
        name: config.name,
        version: config.version,
        hash: hash,
    };
}