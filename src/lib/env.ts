// import os from "node:os";
// import path from "node:path";

// export const isWin = process.platform === "win32";

// export function cpuCount(): number {
//   try { return os.cpus()?.length || 8; } catch { return 8; }
// }

// export function joinPathList(paths: string[]): string {
//   const sep = isWin ? ";" : ":";
//   return paths.filter(Boolean).join(sep);
// }

// export function exe(name: string): string {
//   return isWin ? `${name}.exe` : name;
// }

// export function normalizePath(p: string): string {
//   return path.resolve(p);
// }