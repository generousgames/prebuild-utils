import path from "path";
import { fs } from "zx";
import { log } from "./log";

const PREBUILD_CONFIG_FILE = "prebuild.json";

export type PlatformType = "macos" | "ios" | "windows" | "linux";
export type ArchType = "arm64" | "x86_64";
export type BuildType = "Release" | "Debug";

export type TargetConfig = {
    // The platform type.
    type: PlatformType;

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

export type PrebuildConfig = {
    // The name of the dependency.
    name: string;
    // The version of the dependency.
    version: string;

    // The CMake preset to use.
    cmake_preset: string;

    // The target configuration.
    target: TargetConfig;

    // The compiler configuration.
    compiler: CompilerConfig;
};

export function load_prebuild_config(rootDir: string, presetName: string): PrebuildConfig | undefined {
    const prebuild = path.join(rootDir, PREBUILD_CONFIG_FILE);
    if (!fs.existsSync(prebuild)) {
        log.err("Prebuild config file not found.");
        process.exit(1);
    }
    const prebuildJson = JSON.parse(fs.readFileSync(prebuild, "utf8"));

    return {
        name: prebuildJson.name,
        version: prebuildJson.version,
        ...prebuildJson.configs[presetName],
    }
}

export function print_prebuild_config(config: PrebuildConfig) {
    log.info(`> ${config.name}: ${config.version}`);
    log.info(`> CMake Preset: ${config.cmake_preset}`);
    log.info(`> Platform: ${config.target.type}`);
    log.info(`> Arch: ${config.target.arch}`);
    log.info(`> Build Type: ${config.target.build_type}`);
    log.info(`> C Compiler: ${config.compiler.c_compiler}`);
    log.info(`> C++ Compiler: ${config.compiler.cxx_compiler}`);
    log.info(`> Stdlib: ${config.compiler.stdlib}`);
    log.info(`> C++ Std: ${config.compiler.cxx_std}`);
    log.info(`> C++ Flags: ${config.compiler.cxx_flags}`);
    if (config.compiler.build && config.target.type === "macos") {
        log.info(`> OSX Deployment Target: ${config.compiler.build.deployment_target}`);
    }
}