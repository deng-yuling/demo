/**
 * 2048 纯逻辑（无 DOM）
 * 浏览器：挂载到 window.Game2048Core
 * 测试：node --test 通过 test/load-core.mjs 加载
 */
(function (global) {
  "use strict";

  const SIZE = 4;
  const WIN_VALUE = 2048;

  const FACES = {
    2: "😊",
    4: "🙂",
    8: "😄",
    16: "🤩",
    32: "⭐",
    64: "💫",
    128: "🌸",
    256: "🎀",
    512: "💖",
    1024: "🌟",
    2048: "👑",
  };

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function cloneGrid(grid) {
    return grid.map((row) => [...row]);
  }

  function gridsEqual(a, b) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (a[r][c] !== b[r][c]) return false;
      }
    }
    return true;
  }

  function slideRowLeft(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];
    let gained = 0;
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        result.push(merged);
        gained += merged;
        i += 2;
      } else {
        result.push(filtered[i]);
        i++;
      }
    }
    while (result.length < SIZE) result.push(0);
    return { row: result, gained };
  }

  function rotateGrid(g, times) {
    let current = cloneGrid(g);
    for (let t = 0; t < times; t++) {
      const rotated = emptyGrid();
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          rotated[c][SIZE - 1 - r] = current[r][c];
        }
      }
      current = rotated;
    }
    return current;
  }

  function unrotateGrid(g, times) {
    const unrot = (SIZE - (times % 4)) % 4;
    return rotateGrid(g, unrot);
  }

  function applyMoveLeft(grid) {
    let moved = false;
    let score = 0;
    const newGrid = emptyGrid();

    for (let r = 0; r < SIZE; r++) {
      const { row, gained } = slideRowLeft(grid[r]);
      score += gained;
      if (row.some((v, i) => v !== grid[r][i])) moved = true;
      newGrid[r] = row;
    }

    return { grid: newGrid, score, moved };
  }

  function moveGrid(grid, direction) {
    const rotations = { left: 0, up: 3, right: 2, down: 1 };
    const rot = rotations[direction];
    if (rot === undefined) {
      return { grid: cloneGrid(grid), score: 0, moved: false };
    }

    const rotated = rotateGrid(grid, rot);
    const { grid: slid, score, moved } = applyMoveLeft(rotated);
    return { grid: unrotateGrid(slid, rot), score, moved };
  }

  function canMove(grid) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return true;
        if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
      }
    }
    return false;
  }

  function hasWon(grid, winValue = WIN_VALUE) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] >= winValue) return true;
      }
    }
    return false;
  }

  function countEmpty(grid) {
    let n = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) n++;
      }
    }
    return n;
  }

  function tileClass(value) {
    if (value <= 2048) return `tile-${value}`;
    return "tile-super";
  }

  function formatValue(value) {
    if (value <= 2048) return String(value);
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return String(value);
  }

  function getFace(value) {
    if (value <= 2048 && FACES[value]) return FACES[value];
    if (value > 2048) return "🚀";
    return "";
  }

  global.Game2048Core = {
    SIZE,
    WIN_VALUE,
    FACES,
    emptyGrid,
    cloneGrid,
    gridsEqual,
    slideRowLeft,
    rotateGrid,
    unrotateGrid,
    applyMoveLeft,
    moveGrid,
    canMove,
    hasWon,
    countEmpty,
    tileClass,
    formatValue,
    getFace,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
