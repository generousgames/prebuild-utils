import { generate_abi_hash, generate_abi_short_hash, print_abi_info } from "./abi.js";
import { log } from "./log.js";
import { PrebuildConfig, print_prebuild_config } from "./config.js";
import { generate_manifest } from "./manifest.js";
import archiver from "archiver";
import { fs, path } from "zx";

/**
 * Zips a directory into a zip file.
 * @param inputDir - The directory to zip.
 * @param outZipPath - The path to the zip file.
 */
export async function zipDir(inputDir: string, outZipPath: string) {
    await fs.promises.mkdir(path.dirname(outZipPath), { recursive: true });

    const output = fs.createWriteStream(outZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } }); // max compression

    const done = new Promise<void>((resolve, reject) => {
        output.on("close", () => resolve());
        output.on("error", reject);
        archive.on("warning", (err: any) => {
            // ENOENT warnings can be ignored; others usually not
            if ((err as any).code === "ENOENT") console.warn(err);
            else reject(err);
        });
        archive.on("error", reject);
    });

    archive.pipe(output);

    // Put folder contents at the root of the zip.
    // If you want the folder name as the top-level entry, replace `false` with `path.basename(inputDir)`.
    archive.directory(inputDir, false);

    await archive.finalize();
    await done;
}

/**
 * Bundles the dependency given a CMake preset name.
 * @param rootDir - The root directory of the repository.
 * @param config - The configuration for the dependency.
 */
export async function bundle_dependency(rootDir: string, config: PrebuildConfig) {
    const { cmake_preset, target, compiler } = config;

    const abi = {
        c_compiler: compiler.c_compiler,
        cxx_compiler: compiler.cxx_compiler,
        arch: target.arch,
        stdlib: compiler.stdlib,
        cxx_std: compiler.cxx_std,
        cxx_flags: compiler.cxx_flags,
        build_type: target.build_type,
    };

    log.info("Bundling dependency...");
    print_prebuild_config(config);
    print_abi_info(abi);

    // Create folder rootDir/bundles/presetName.
    const fs = await import("fs");
    const path = await import("path");
    const bundleDir = path.join(rootDir, "bundles", cmake_preset);
    const contentsDir = path.join(bundleDir, "contents");
    fs.rmSync(contentsDir, { recursive: true, force: true });
    if (!fs.existsSync(contentsDir)) {
        fs.mkdirSync(contentsDir, { recursive: true });
    }

    // Copy license file.
    const licenseFile = path.join(rootDir, "dependencies", "glfw", "LICENSE.md");
    fs.copyFileSync(licenseFile, path.join(contentsDir, "LICENSE.md"));

    // Copy headers.
    const headersDir = path.join(rootDir, "dependencies", "glfw", "include");
    fs.cpSync(headersDir, path.join(contentsDir, "include"), { recursive: true });

    // Copy static libs.
    const staticLibsDir = path.join(rootDir, "build", "lib", target.build_type);
    fs.cpSync(staticLibsDir, path.join(contentsDir, "libs"), { recursive: true });

    // Create manifest.
    const hash = generate_abi_hash(abi);
    const manifest = generate_manifest(config, hash);
    fs.writeFileSync(path.join(contentsDir, "manifest.json"), JSON.stringify(manifest, null, 2));

    // Create archive.
    const archiveFile = path.join(bundleDir, `${config.name}-${config.version}-${hash}.zip`);

    // Zip the bundle directory into the archive file.
    await zipDir(contentsDir, archiveFile);
}