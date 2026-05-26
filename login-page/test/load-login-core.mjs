import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadLoginCore(baseDir = join(__dirname, "..")) {
  const src = readFileSync(join(baseDir, "login-core.js"), "utf8");
  const ctx = { globalThis: {} };
  vm.runInNewContext(src, ctx);
  return ctx.globalThis.LoginCore;
}
