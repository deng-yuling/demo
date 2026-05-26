import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadGameCore(baseDir = join(__dirname, "..")) {
  const src = readFileSync(join(baseDir, "game-core.js"), "utf8");
  const ctx = { globalThis: {} };
  vm.runInNewContext(src, ctx);
  return ctx.globalThis.Game2048Core;
}
