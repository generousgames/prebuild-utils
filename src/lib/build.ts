import { PrebuildConfig, print_prebuild_config } from "./config.js";
import { run, ensureTool } from "./exec.js";
import { log } from "./log.js";

/**
 * Builds the dependency given a CMake preset name.
 * @param rootDir - The root directory of the repository.
 * @param config - The configuration for the dependency.
 */
export async function build_dependency(rootDir: string, config: PrebuildConfig) {
    const { cmake_preset, target, compiler } = config;

    log.info("Building dependency...");
    print_prebuild_config(config);

    const env = {
        ...process.env,
        PREBUILD_ARCH: target.arch,
    } as Record<string, string>;

    if (target.type === "macos") {
        env["PREBUILD_OSX_DEPLOYMENT_TARGET"] = compiler.build?.deployment_target ?? "";
    } else if (target.type === "ios") {
        env["PREBUILD_IOS_DEPLOYMENT_TARGET"] = compiler.build?.deployment_target ?? "";
    }

    await ensureTool("cmake");
    await run("cmake", ["--preset", cmake_preset], { cwd: rootDir, env });
    await run("cmake", ["--build", `projects/${cmake_preset}`, "--config", target.build_type, "--parallel"], { cwd: rootDir, env });
}