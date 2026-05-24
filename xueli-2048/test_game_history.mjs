import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { loadGameHistory } from "./test/load-history.mjs";

const memory = new Map();
let api;

beforeEach(() => {
  memory.clear();
  const localStorage = {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
    removeItem: (k) => memory.delete(k),
  };
  api = loadGameHistory(undefined, localStorage);
  memory.delete(api.HISTORY_KEY);
});

describe("game history", () => {
  it("getRankedHistory sorts by score descending", () => {
    api.addGameRecord(50);
    api.addGameRecord(300);
    api.addGameRecord(120);
    const ranked = api.getRankedHistory();
    assert.deepEqual([...ranked.map((x) => x.score)], [300, 120, 50]);
  });

  it("persists to localStorage", () => {
    api.addGameRecord(88);
    assert.equal(api.loadHistory()[0].score, 88);
  });
});
