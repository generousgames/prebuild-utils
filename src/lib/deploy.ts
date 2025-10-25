import { PrebuildConfig, print_prebuild_config } from "./config.js";
import { log } from "./log.js";

export async function deploy_dependency(rootDir: string, config: PrebuildConfig) {

    log.info("Deploying dependency...");
    print_prebuild_config(config);

    // await ensureTool("cmake");
    // await run("cmake", ["--preset", presetName], { cwd: rootDir });
    // await run("cmake", ["--build", `projects/${presetName}`, "--parallel"], { cwd: rootDir });
}

// export async function cmake_build_app(rootDir: string, appTarget: string, buildTarget: string, buildType: string) {
//     await ensureTool("cmake");

//     // mkdir -p ${SCRIPT_DIR}/../projects/${APP_TARGET}-${BUILD_TARGET}-${BUILD_TYPE}
//     // cmake--preset ${ BUILD_TARGET } -${ BUILD_TYPE } -DMIMI_APP_TARGET=${ APP_TARGET }
//     // cmake--build--preset app - ${ BUILD_TARGET } -${ BUILD_TYPE }

//     const APP_BUILD_NAME = `${appTarget}-${buildTarget}-${buildType}`;
//     const PRESET_NAME = `${buildTarget}-${buildType}`;

//     const env = {
//         ...process.env,
//         APP_TARGET: appTarget,
//         BUILD_TARGET: buildTarget,
//         BUILD_TYPE: buildType,
//     };

//     // Create project directory.
//     await run("mkdir", ["-p", `${rootDir}/projects/${APP_BUILD_NAME}`], { cwd: rootDir, env });

//     // Generate project files.
//     await run("cmake", ["--preset", PRESET_NAME, `-DMIMI_APP_TARGET=${appTarget}`], { cwd: rootDir, env });

//     // Build project.
//     await run("cmake", ["--build", "--preset", `app-${buildTarget}-${buildType}`], { cwd: rootDir, env });
// }

// export async function cmake_run_tests(rootDir: string, buildType: string) {
//     await ensureTool("cmake");

//     // mkdir -p ${SCRIPT_DIR}/../projects/${APP_TARGET}-${BUILD_TARGET}
//     // cmake --preset ${APP_TARGET} -DMIMI_APP_TARGET=${APP_TARGET}
//     // cmake --build --preset app-${APP_TARGET}-${BUILD_TYPE}
//     // ctest -C ${BUILD_TYPE} --test-dir ${SCRIPT_DIR}/../projects/${APP_TARGET}-${BUILD_TARGET} --output-on-failure

//     const APP_TARGET = `tests`;
//     const BUILD_TARGET = `host`;
//     const BUILD_TYPE = buildType;
//     const APP_BUILD_NAME = `${APP_TARGET}-${BUILD_TARGET}`;

//     const env = {
//         ...process.env,
//         BUILD_TYPE: buildType,
//     };

//     // Create project directory.
//     await run("mkdir", ["-p", `${rootDir}/projects/${APP_BUILD_NAME}`], { cwd: rootDir, env });

//     // Generate project files.
//     await run("cmake", ["--preset", APP_TARGET, `-DMIMI_APP_TARGET=${APP_TARGET}`], { cwd: rootDir, env });

//     // Build project.
//     await run("cmake", ["--build", "--preset", `app-${APP_TARGET}-${BUILD_TYPE}`], { cwd: rootDir, env });

//     // Run tests.
//     await run("ctest", ["-C", BUILD_TYPE, "--test-dir", `${rootDir}/projects/${APP_TARGET}-${BUILD_TARGET}`, "--output-on-failure"], { cwd: rootDir, env, verbose: true });
// }

// // import { run, ensureTool } from "./exec.js";
// // import { cpuCount } from "./env.js";
// // import { log } from "./log.js";

// // type Cfg = "Debug" | "Release" | "RelWithDebInfo" | "MinSizeRel";

// // export async function configure(opts: {
// //     srcDir?: string; buildDir?: string; preset?: string; extraArgs?: string[];
// // }) {
// //     await ensureTool("cmake");
// //     const {
// //         srcDir = ".",
// //         buildDir = "build",
// //         preset,
// //         extraArgs = []
// //     } = opts;

// //     const args = ["-S", srcDir, "-B", buildDir, ...extraArgs];
// //     if (preset) args.unshift("--preset", preset); // if using CMakePresets.json
// //     await run("cmake", args);
// //     log.ok("Configured.");
// // }

// // export async function build(opts: {
// //     buildDir?: string; config?: Cfg; jobs?: number; targets?: string[];
// // }) {
// //     await ensureTool("cmake");
// //     const { buildDir = "build", config = "Debug", jobs = cpuCount(), targets = [] } = opts;

// //     const args = ["--build", buildDir, "--config", config, "-j", String(jobs), ...targets.flatMap(t => ["--target", t])];
// //     await run("cmake", args);
// //     log.ok(`Built (${config}).`);
// // }

// // export async function ctest(opts: { buildDir?: string; config?: Cfg }) {
// //     await ensureTool("ctest");
// //     const { buildDir = "build", config = "Debug" } = opts;
// //     const args = ["--output-on-failure", "-C", config, "--test-dir", buildDir];
// //     await run("ctest", args);
// //     log.ok("Tests passed.");
// // }