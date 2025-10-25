// import path from "path";
// import { log } from "./log.js";
// import { fs } from "zx";
// import axios from "axios";
// import AdmZip from "adm-zip";

// export async function deps_sync(rootDir: string, triplet: string) {
//     const depsDir = path.join(rootDir, "deps");
//     const depsLockFile = path.join(depsDir, "configs", `${triplet}.lock.json`);
//     const depsPackagesDir = path.join(depsDir, "packages", triplet);

//     if (!fs.existsSync(depsLockFile)) {
//         log.err(`Dependencies lock file not found: ${depsLockFile}`);
//         process.exit(1);
//     }

//     const depsLock = JSON.parse(fs.readFileSync(depsLockFile, "utf8"));
//     for (const pkg of depsLock.packages) {
//         const { name, version, abi, url, sha256 } = pkg;
//         const pkgDir = `${name}-${version}-${abi}`;

//         log.info(`[package]: ${name}(version: ${version}, abi: ${abi})`);

//         // Ensure destination directory exists
//         fs.mkdirSync(depsPackagesDir, { recursive: true });

//         // Download the package.
//         log.info(`> Downloading ${path.basename(url)}...`);
//         const responseStream = await axios.get(url, { responseType: "stream" });
//         const writer = [];
//         {
//             // Render a download bar.
//             const barTotal = 100;
//             process.stdout.write("  [");
//             let downloaded = 0;
//             let lastBar = 0;

//             if (responseStream.status !== 200) {
//                 log.err(`Failed to download ${url}`);
//                 process.exit(1);
//             }

//             const totalSize = parseInt(responseStream.headers["content-length"] ?? "0", 10);
//             let currDownloaded = 0;
//             process.stdout.write(" ".repeat(barTotal) + `] 0%`);
//             process.stdout.cursorTo(3);

//             // Capture download data.
//             for await (const chunk of responseStream.data) {
//                 writer.push(chunk);
//                 currDownloaded += chunk.length;
//                 let progress = totalSize ? Math.floor((currDownloaded / totalSize) * barTotal) : 0;
//                 if (progress > lastBar) {
//                     process.stdout.write("=".repeat(progress - lastBar));
//                     lastBar = progress;
//                 }
//                 // Print percent at end of line
//                 process.stdout.cursorTo(3 + barTotal + 1);
//                 const percent = totalSize ? Math.floor((currDownloaded / totalSize) * 100) : 0;
//                 process.stdout.write(` ${percent}%`);
//                 process.stdout.cursorTo(3 + lastBar);
//             }
//             process.stdout.write("\n");
//         }
//         // Buffer for unzip.
//         const response = {
//             status: responseStream.status,
//             data: Buffer.concat(writer),
//         };

//         // Decompress the package.
//         log.info(`> Decompressing to packages/${triplet}/${pkgDir}...`);
//         const zip = new AdmZip(Buffer.from(response.data));
//         zip.extractAllTo(depsPackagesDir, true);
//     }
// }