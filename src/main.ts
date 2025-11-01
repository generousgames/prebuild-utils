import path from "path";
import { build_dependency } from "./lib/build";
import { bundle_dependency } from "./lib/bundle";
import { deploy_dependency } from "./lib/deploy";
import { log } from "./lib/log";
import { fs } from "zx";
import { load_build_config } from "./lib/config";

// # TODO
// # (done) Be able to build for OSX.
// # (---) Be able to build for multiple architectures.
// # Be able to generate a package / bundle ABI hash.
// # Be able to generate a package / bundle manifest.
// # Be able to package / bundle the build output (static libs, headers, licenses, etc.).
// # Be able to upload the package to a remote server.
// # Integrate with the CI / CD pipeline.

///////////////////////////////////////////////////////////////////////////////

function findRepoRoot(startDir: string): string {
    let dir = startDir;
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, "CMakeLists.txt"))) return dir;
        dir = path.dirname(dir);
    }
    throw new Error("Could not find repo root (CMakeLists.txt not found).");
}

///////////////////////////////////////////////////////////////////////////////

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

// Clean temporary build directories.
function clean() {
    const rootDir = findRepoRoot(process.cwd());
    log.info(`Cleaning...`);
    log.info(`> Root: ${rootDir}`);

    const dirs = ["build", "projects", "bundles"];
    for (const dir of dirs) {
        const full = path.join(rootDir, dir);
        if (fs.existsSync(full)) {
            fs.rmSync(full, { recursive: true, force: true });
            log.info(`> Removed ${full}`);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

// Build.
function build(argv: string[]) {
    if (argv.length !== 4) {
        log.err("Usage: prebuild-cli build <config_name>");
        process.exit(1);
    }
    const configName = argv[3];

    const rootDir = findRepoRoot(process.cwd());
    const config = load_build_config(rootDir, configName);
    if (!config) {
        log.err(`Config ${configName} not found in manifest.`);
        process.exit(1);
    }

    build_dependency(rootDir, config);
}

// Bundle.
function bundle(argv: string[]) {
    if (argv.length !== 4) {
        log.err("Usage: prebuild-cli bundle <config_name>");
        process.exit(1);
    }
    const configName = argv[3];

    const rootDir = findRepoRoot(process.cwd());
    const config = load_build_config(rootDir, configName);
    if (!config) {
        log.err(`Config ${configName} not found in manifest.`);
        process.exit(1);
    }

    bundle_dependency(rootDir, config);
}

// Deploy.
function deploy(argv: string[]) {
    if (argv.length !== 4) {
        log.err("Usage: prebuild-cli deploy <config_name>");
        process.exit(1);
    }
    const configName = argv[3];
    const rootDir = findRepoRoot(process.cwd());
    const config = load_build_config(rootDir, configName);
    if (!config) {
        log.err(`Config ${configName} not found in manifest.`);
        process.exit(1);
    }

    deploy_dependency(rootDir, config);
}

///////////////////////////////////////////////////////////////////////////////

// Process command line arguments.
const command = process.argv[2];
if (command === "setup") {
    setup(process.argv);
} else if (command === "clean") {
    clean();
} else if (command === "build") {
    build(process.argv);
} else if (command === "bundle") {
    bundle(process.argv);
} else if (command === "deploy") {
    deploy(process.argv);
} else {
    log.err(`Unknown command: ${command}`);
    process.exit(1);
}