import { fs } from "zx";
import { run, ensureTool } from "./exec.js";
import { log } from "./log.js";
import shasum from "shasum";

/**
 * ABI information.
 */
export type AbiInfo = {
    c_compiler: string;
    cxx_compiler: string;
    os: string;
    arch: string;
    stdlib: string;
    cxx_std: string;
    cxx_flags: string;
};

/**
 * Generate an ABI hash from the given ABI information.
 * @param abi_info - The ABI information.
 * @returns The ABI hash.
 */
export async function generate_abi_hash(abi_info: AbiInfo) {
    const { c_compiler, cxx_compiler, os, arch, stdlib, cxx_std, cxx_flags } = abi_info;
    const fingerprint = `${c_compiler}|${cxx_compiler}|${os}|${arch}|${stdlib}|${cxx_std}|${cxx_flags}`;
    const abi_hash = await shasum(fingerprint);

    log.info(`ABI fingerprint: ${fingerprint}`);
    log.info(`ABI hash: ${abi_hash}`);
    return abi_hash;
}

/**
 * Generate an ABI short hash from the given ABI information.
 * @param abi_info - The ABI information.
 * @param bytes - The number of bytes to include in the short hash.
 * @returns The ABI short hash.
 */
export async function generate_abi_short_hash(abi_info: AbiInfo, bytes: number = 8) {
    const abi_hash = await generate_abi_hash(abi_info);
    const abi_hash_short = abi_hash.slice(0, bytes);

    log.info(`ABI hash (short): ${abi_hash_short}`);
    return abi_hash_short;
}

await generate_abi_short_hash({
    c_compiler: "clang",
    cxx_compiler: "clang++",
    os: "darwin",
    arch: "x86_64",
    stdlib: "libc++",
    cxx_std: "c++20",
    cxx_flags: "",
});