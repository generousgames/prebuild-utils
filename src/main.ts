import path from "path";
import { cmake_build_preset } from "./lib/cmake";
import { log } from "./lib/log";
import { fs } from "zx";
// import { deps_sync } from "./lib/deps";

// # TODO
// # (done) Be able to build for OSX.
// # (---) Be able to build for multiple architectures.
// # Be able to generate a package / bundle ABI hash.
// # Be able to generate a package / bundle manifest.
// # Be able to package / bundle the build output (static libs, headers, licenses, etc.).
// # Be able to upload the package to a remote server.
// # Integrate with the CI / CD pipeline.

function findRepoRoot(startDir: string): string {
    let dir = startDir;
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, "CMakeLists.txt"))) return dir;
        dir = path.dirname(dir);
    }
    throw new Error("Could not find repo root (CMakeLists.txt not found).");
}

// Setup mimi and external dependencies.
function setup(argv: string[]) {
    const rootDir = findRepoRoot(process.cwd());

    log.info(`Setting up mimi and external dependencies...`);
    log.info(`> Root: ${rootDir}`);

    // TODO
    // + Check if nodejs is installed with the right version.
    // + Check if CMake is installed.
    // + Check if Emscripten is installed.

    // deps_sync(rootDir, "macos-arm64-clang17");
}

// // Generate project files.
// function gen_proj(argv: string[]) {
//     if (argv.length !== 5) {
//         log.err("Usage: mimi gen_proj <app_target> <build_target>");
//         process.exit(1);
//     }

//     const rootDir = findRepoRoot(process.cwd());
//     const app_target = argv[3];
//     const build_target = argv[4];

//     log.info(`Generating project for ${app_target} ${build_target}...`);
//     log.info(`> Root: ${rootDir}`);
//     log.info(`> App Target: ${app_target}`);
//     log.info(`> Build Target: ${build_target}`);

//     cmake_configure_with_preset(rootDir, app_target, build_target);
// }

// // Build app target.
// function build_app(argv: string[]) {
//     if (argv.length !== 6) {
//         log.err("Usage: mimi build <app_target> <build_target> <build_type>");
//         process.exit(1);
//     }

//     const rootDir = findRepoRoot(process.cwd());
//     const app_target = argv[3];
//     const build_target = argv[4];
//     const build_type = argv[5];

//     log.info(`Building ${app_target} ${build_target} ${build_type}...`);
//     log.info(`> Root: ${rootDir}`);
//     log.info(`> App Target: ${app_target}`);
//     log.info(`> Build Target: ${build_target}`);
//     log.info(`> Build Type: ${build_type}`);

//     cmake_build_app(rootDir, app_target, build_target, build_type);
// }

// // Run tests.
// function run_tests(argv: string[]) {
//     if (argv.length !== 4) {
//         log.err("Usage: mimi run_tests <build_type>");
//         process.exit(1);
//     }

//     const rootDir = findRepoRoot(process.cwd());
//     const build_type = argv[3];

//     log.info(`Running tests ${build_type}...`);
//     log.info(`> Root: ${rootDir}`);
//     log.info(`> Build Type: ${build_type}`);

//     cmake_run_tests(rootDir, build_type);
// }

// // Run web server.
// function run_web_server(argv: string[]) {
//     if (argv.length !== 5) {
//         log.err("Usage: mimi run_web_server <app_target> <build_type>");
//         process.exit(1);
//     }

//     const rootDir = findRepoRoot(process.cwd());
//     const app_target = argv[3];
//     const build_type = argv[4];

//     log.info(`Running web server...`);
//     log.info(`> Root: ${rootDir}`);
//     log.info(`> App Target: ${app_target}`);
//     log.info(`> Build Type: ${build_type}`);

//     em_run_web_server(rootDir, app_target, build_type);
// }






// Build.
function build_dep(argv: string[]) {
    if (argv.length !== 5) {
        log.err("Usage: prebuild-cli build <build_target> <build_type>");
        process.exit(1);
    }

    const rootDir = findRepoRoot(process.cwd());
    const build_type = argv[3];

    log.info(`Building ${build_type}...`);
    log.info(`> Root: ${rootDir}`);
    log.info(`> Build Type: ${build_type}`);

    cmake_build_preset(rootDir, build_type);
    
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

}

// Clean temporary build directories.
function clean() {
    const rootDir = findRepoRoot(process.cwd());
    log.info(`Cleaning...`);
    log.info(`> Root: ${rootDir}`);

    const dirs = ["build", "projects"];
    for (const dir of dirs) {
        const full = path.join(rootDir, dir);
        if (fs.existsSync(full)) {
            fs.rmSync(full, { recursive: true, force: true });
            log.info(`> Removed ${full}`);
        }
    }
}

// Process command line arguments.
const command = process.argv[2];
if (command === "setup") {
    setup(process.argv);
} else if (command === "build_dep") {
    build_dep(process.argv);
} else if (command === "clean") {
    clean();
} else {
    log.err(`Unknown command: ${command}`);
    process.exit(1);
}