import { generate_abi_hash, generate_abi_short_hash, print_abi_info } from "./abi.js";
import { log } from "./log.js";
import { PrebuildConfig, print_prebuild_config } from "./config.js";

export async function bundle_dependency(rootDir: string, config: PrebuildConfig) {
    const { cmake_preset, build_type, c_compiler, cxx_compiler, os, arch, stdlib, cxx_std, cxx_flags } = config;

    const abi = {
        c_compiler,
        cxx_compiler,
        os,
        arch,
        stdlib,
        cxx_std,
        cxx_flags,
    };

    log.info("Bundling dependency...");
    print_prebuild_config(config);
    print_abi_info(abi);

    // Create folder rootDir/bundles/presetName.
    const fs = await import("fs");
    const path = await import("path");
    const bundleDir = path.join(rootDir, "bundles", cmake_preset);
    fs.rmSync(bundleDir, { recursive: true, force: true });
    if (!fs.existsSync(bundleDir)) {
        fs.mkdirSync(bundleDir, { recursive: true });
    }

    // Copy license file.
    const licenseFile = path.join(rootDir, "dependencies", "glfw", "LICENSE.md");
    fs.copyFileSync(licenseFile, path.join(bundleDir, "LICENSE.md"));

    // Copy headers.
    const headersDir = path.join(rootDir, "dependencies", "glfw", "include");
    fs.cpSync(headersDir, path.join(bundleDir, "include"), { recursive: true });

    // Copy static libs.
    const staticLibsDir = path.join(rootDir, "build", "lib", build_type);
    fs.cpSync(staticLibsDir, path.join(bundleDir, "libs"), { recursive: true });

    // Generate ABI hash.
    const hash = generate_abi_hash(abi);

    // // Archive the bundle.
    // const zipFile = path.join(bundleDir, `${presetName}.zip`);
    // fs.zipSync(bundleDir, zipFile);

    // TODO
    // * Generate manifest with information (name, version, ABI hash, etc.).
    // * Package the build output (static libs, headers, licenses, etc.).
    // * Upload the package to a remote server.


    //     pushd ${OUTPUT_DIR}
    //     PREBUILT_DIR="${NAME}-${VERSION}-${ABI_HASH}"
    //     mkdir -p "${PREBUILT_DIR}"

    //     cp -rf ${ROOT}/dependencies/glfw/LICENSE.md ${PREBUILT_DIR}/LICENSE.md
    //     cp -rf ${ROOT}/dependencies/glfw/include/* ${PREBUILT_DIR}/include
    //     cp -rf ${LIB_DIR}/${BUILD_TYPE} ${PREBUILT_DIR}/libs

    //     zip -r ${PREBUILT_DIR}.zip ${PREBUILT_DIR}
    // popd

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