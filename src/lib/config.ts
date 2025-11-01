import path from "path";
import { fs } from "zx";
import { log } from "./log";

const BUILD_CONFIG_FILE = "build.json";

export type OSType = "macos" | "ios" | "windows" | "linux";
export type ArchType = "arm64" | "x86_64";
export type BuildType = "Release" | "Debug";

export type PlatformConfig = {
    // The operating system.
    os: OSType;

    // The architecture to build for.
    arch: ArchType;

    // The build type to use.
    build_type: BuildType;
};

export type OSXBuildConfig = {
    deployment_target: string;
};
export type iOSBuildConfig = {
    deployment_target: string;
};

export type CompilerConfig = {
    // The C compiler to use.
    c_compiler: string;
    // The C++ compiler to use.
    cxx_compiler: string;

    // The standard library to use.
    stdlib: string;
    // The C++ standard to use.
    cxx_std: string;
    // The C++ flags to use.
    cxx_flags: string;

    // Additional build configuration.
    build?: OSXBuildConfig | iOSBuildConfig;
};

export type BuildConfig = {
    // The name of the dependency.
    name: string;
    // The version of the dependency.
    version: string;

    // The platform configuration.
    platform: PlatformConfig;

    // The compiler configuration.
    compiler: CompilerConfig;
};

/**
 * Get the triplet for the given platform.
 * @param platform - The platform configuration.
 * @returns The triplet.
 */
export function get_platform_triplet(platform: PlatformConfig): string {
    return `${platform.os}-${platform.arch}-${platform.build_type}`;
}

/**
 * Load the build configuration from the given root directory.
 * @param rootDir - The root directory of the repository.
 * @param presetName - The name of the preset to load.
 * @returns The build configuration.
 */
export function load_build_config(rootDir: string, presetName: string): BuildConfig | undefined {
    const build = path.join(rootDir, BUILD_CONFIG_FILE);
    if (!fs.existsSync(build)) {
        log.err("Build config file not found.");
        process.exit(1);
    }
    const buildJson = JSON.parse(fs.readFileSync(build, "utf8"));

    return {
        name: buildJson.name,
        version: buildJson.version,
        ...buildJson.configs[presetName],
    }
}

/**
 * Print the build configuration.
 * @param config - The build configuration.
 */
export function print_build_config(config: BuildConfig) {
    log.info(`${config.name} ${config.version}`);
    log.info(`> Platform: ${get_platform_triplet(config.platform)}`);
    log.info(`> C Compiler: ${config.compiler.c_compiler}`);
    log.info(`> C++ Compiler: ${config.compiler.cxx_compiler}`);
    log.info(`> Stdlib: ${config.compiler.stdlib}`);
    log.info(`> C++ Std: ${config.compiler.cxx_std}`);
    log.info(`> C++ Flags: ${config.compiler.cxx_flags}`);
    if (config.compiler.build && config.platform.os === "macos") {
        log.info(`> macOS Deployment Target: ${config.compiler.build.deployment_target}`);
    }
    if (config.compiler.build && config.platform.os === "ios") {
        log.info(`> iOS Deployment Target: ${config.compiler.build.deployment_target}`);
    }
}