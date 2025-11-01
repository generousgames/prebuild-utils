import { log } from "./log.js";
import shasum from "shasum";
import { BuildConfig } from "./config.js";

/**
 * ABI information.
 */
export type AbiInfo = {
    c_compiler: string;
    cxx_compiler: string;
    arch: string;
    stdlib: string;
    cxx_std: string;
    cxx_flags: string;
    build_type: string;
};

/**
 * Generate ABI information from the given configuration.
 * @param config - The configuration.
 * @returns The ABI information.
 */
export function generate_abi_from_config(config: BuildConfig): AbiInfo {
    const { platform, compiler } = config;
    return {
        c_compiler: compiler.c_compiler,
        cxx_compiler: compiler.cxx_compiler,
        stdlib: compiler.stdlib,
        cxx_std: compiler.cxx_std,
        cxx_flags: compiler.cxx_flags,
        arch: platform.arch,
        build_type: platform.build_type,
    };
}

/**
 * Generate an ABI fingerprint from the given ABI information.
 * @param abi_info - The ABI information.
 * @returns The ABI fingerprint.
 */
function generate_abi_fingerprint(abi_info: AbiInfo) {
    const { c_compiler, cxx_compiler, arch, stdlib, cxx_std, cxx_flags, build_type } = abi_info;
    return `${c_compiler}|${cxx_compiler}|${arch}|${stdlib}|${cxx_std}|${cxx_flags}|${build_type}`;
}

/**
 * Generate an ABI hash from the given ABI information.
 * @param abi_info - The ABI information.
 * @returns The ABI hash.
 */
export function generate_abi_hash(abi_info: AbiInfo) {
    const fingerprint = generate_abi_fingerprint(abi_info);
    return shasum(fingerprint);
}

/**
 * Generate an ABI short hash from the given ABI information.
 * @param abi_info - The ABI information.
 * @param bytes - The number of bytes to include in the short hash.
 * @returns The ABI short hash.
 */
export function generate_abi_short_hash(abi_info: AbiInfo, bytes: number = 8) {
    return generate_abi_hash(abi_info).slice(0, bytes);
}

/**
 * Print the ABI information to the console.
 * @param abi_info - The ABI information.
 */
export function print_abi_info(abi_info: AbiInfo) {
    const fingerprint = generate_abi_fingerprint(abi_info);
    const abi_hash = generate_abi_hash(abi_info);
    const abi_hash_short = generate_abi_short_hash(abi_info);

    log.info(`ABI information...`);
    log.info(`> Fingerprint: ${fingerprint}`);
    log.info(`> Hash: ${abi_hash}`);
    log.info(`> Hash (short): ${abi_hash_short}`);
}