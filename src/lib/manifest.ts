import path from "path";
import { PrebuildConfig } from "./config";
import { fs } from "zx";
import { log } from "./log";

export function generate_manifest(config: PrebuildConfig, outputPath: string) {
    const manifest = {
        cmake_preset: config.cmake_preset,
        platform: config.platform,
        arch: config.arch,
        build_type: config.build_type,
        c_compiler: config.c_compiler,
        cxx_compiler: config.cxx_compiler,
        os: config.os,
        stdlib: config.stdlib,
        cxx_std: config.cxx_std,
        cxx_flags: config.cxx_flags,
    };

    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
}