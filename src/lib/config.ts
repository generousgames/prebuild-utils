import path from "path";
import { fs } from "zx";
import { log } from "./log";

const MANIFEST_FILE = "prebuild.manifest.json";

export type PrebuildConfig = {
    name: string;
    version: string;

    cmake_preset: string;

    platform: string;
    arch: string;
    build_type: string;

    c_compiler: string;
    cxx_compiler: string;
    os: string;
    stdlib: string;
    cxx_std: string;
    cxx_flags: string;
};

export function load_prebuild_config(rootDir: string, presetName: string): PrebuildConfig | undefined {
    const manifest = path.join(rootDir, MANIFEST_FILE);
    if (!fs.existsSync(manifest)) {
        log.err("Manifest file not found.");
        process.exit(1);
    }
    const manifestJson = JSON.parse(fs.readFileSync(manifest, "utf8"));

    return {
        name: manifestJson.name,
        version: manifestJson.version,
        ...manifestJson.configs[presetName],
    }
}

export function print_prebuild_config(config: PrebuildConfig) {
    log.info(`> ${config.name}: ${config.version}`);
    log.info(`> CMake Preset: ${config.cmake_preset}`);
    log.info(`> Platform: ${config.platform}`);
    log.info(`> Arch: ${config.arch}`);
    log.info(`> Build Type: ${config.build_type}`);
    log.info(`> C Compiler: ${config.c_compiler}`);
    log.info(`> C++ Compiler: ${config.cxx_compiler}`);
    log.info(`> OS: ${config.os}`);
    log.info(`> Stdlib: ${config.stdlib}`);
    log.info(`> C++ Std: ${config.cxx_std}`);
    log.info(`> C++ Flags: ${config.cxx_flags}`);
}