/**
 * 2048 核心逻辑测试
 * 运行: node --test test_game_core.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadGameCore } from "./test/load-core.mjs";

const {
  SIZE,
  emptyGrid,
  slideRowLeft,
  moveGrid,
  canMove,
  countEmpty,
} = loadGameCore();

describe("emptyGrid", () => {
  it("creates 4x4 grid of zeros", () => {
    const g = emptyGrid();
    assert.equal(g.length, SIZE);
    assert.equal(countEmpty(g), 16);
  });
});

describe("slideRowLeft", () => {
  it("merges equal adjacent tiles", () => {
    const { row, gained } = slideRowLeft([2, 2, 4, 4]);
    assert.deepEqual([...row], [4, 8, 0, 0]);
    assert.equal(gained, 12);
  });
});

describe("moveGrid", () => {
  it("move left merges and slides", () => {
    const grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { grid: next, score, moved } = moveGrid(grid, "left");
    assert.equal(moved, true);
    assert.equal(score, 4);
    assert.equal(next[0][0], 4);
  });

  it("move up merges toward top", () => {
    const grid = [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { grid: next, score } = moveGrid(grid, "up");
    assert.equal(score, 4);
    assert.equal(next[0][1], 4);
  });

  it("move down merges toward bottom", () => {
    const grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { grid: next, score } = moveGrid(grid, "down");
    assert.equal(score, 4);
    assert.equal(next[3][0], 4);
  });
});

describe("canMove", () => {
  it("false on full board with no merges", () => {
    const g = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    assert.equal(canMove(g), false);
  });
});
