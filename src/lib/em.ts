// import { run } from "./exec.js";

// export async function em_run_web_server(rootDir: string, appTarget: string, buildType: string) {
//     const env = {
//         ...process.env,
//         APP_TARGET: appTarget,
//         BUILD_TYPE: buildType,
//     };

//     await run("./external/emsdk/upstream/emscripten/emrun", ["--no_browser", "--port", "8080", `${rootDir}/build/bin/${appTarget}-web-${buildType}/index.html`], { cwd: rootDir, env, verbose: true });
// }