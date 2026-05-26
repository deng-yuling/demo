import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadGameHistory(baseDir = join(__dirname, ".."), localStorage) {
  const src = readFileSync(join(baseDir, "game-history.js"), "utf8");
  const ctx = { globalThis: {}, localStorage };
  vm.runInNewContext(src, ctx);
  return ctx.globalThis.Game2048History;
}
