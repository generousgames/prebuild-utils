import { PrebuildConfig } from "./config";
import { fs } from "zx";
import { log } from "./log";
import { generate_abi_hash } from "./abi";

export function generate_manifest(config: PrebuildConfig, hash: string) {
    return {
        name: config.name,
        version: config.version,
        hash: hash,
    };
}