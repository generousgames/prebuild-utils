import { get_platform_triplet, BuildConfig, print_build_config } from "./config.js";
import { run, ensureTool } from "./exec.js";
import { log } from "./log.js";

/**
 * Builds the dependency given a CMake preset name.
 * @param rootDir - The root directory of the repository.
 * @param config - The configuration for the dependency.
 */
export async function build_dependency(rootDir: string, config: BuildConfig) {
    const { platform, compiler } = config;
    const triplet = get_platform_triplet(platform);

    print_build_config(config);

    try {
        const env = {
            ...process.env,
            BUILD_OS: platform.os,
            BUILD_ARCH: platform.arch,
            BUILD_TYPE: platform.build_type,
            // TODO: Other compiler settings (eg. RTTI, exceptions, etc.).
            // TODO: Other dependency specific flags (eg. GLFW_BUILD_EXAMPLES, GLFW_BUILD_DOCS, etc.).
        } as Record<string, string>;

        if (platform.os === "macos") {
            env["BUILD_OSX_DEPLOYMENT_TARGET"] = compiler.options?.osx?.deployment_target ?? "";
        } else if (platform.os === "ios") {
            env["BUILD_IOS_DEPLOYMENT_TARGET"] = compiler.options?.ios?.deployment_target ?? "";
        }

        await ensureTool("cmake");
        await run("cmake", ["--preset", triplet], { cwd: rootDir, env });
        await run("cmake", ["--build", `projects/${triplet}`, "--config", platform.build_type, "--parallel"], { cwd: rootDir, env });

        log.ok(`Built ${config.name}(${config.version})`);
    } catch (error) {
        log.err(`Failed to build ${config.name}(${config.version})`);
        throw error;
    }
}