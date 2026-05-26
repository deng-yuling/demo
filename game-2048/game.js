(function () {
  "use strict";

  const {
    SIZE,
    emptyGrid,
    moveGrid,
    canMove,
    hasWon,
    tileClass,
    formatValue,
    getFace,
  } = window.Game2048Core;

  const BEST_KEY = "moe2048_best";

  let grid = [];
  let score = 0;
  let best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
  let won = false;
  let keepPlaying = false;
  let touchStart = null;

  const boardEl = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best-score");
  const overlayEl = document.getElementById("overlay");
  const overlayEmoji = document.getElementById("overlay-emoji");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayMsg = document.getElementById("overlay-msg");
  const btnContinue = document.getElementById("btn-continue");
  const btnRetry = document.getElementById("btn-retry");
  const btnNew = document.getElementById("btn-new");

  let tilesLayer = null;
  let cellSize = 0;
  let gap = 10;
  const padding = 10;

  function randomEmptyCell() {
    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) cells.push({ r, c });
      }
    }
    if (!cells.length) return null;
    return cells[Math.floor(Math.random() * cells.length)];
  }

  function addRandomTile() {
    const cell = randomEmptyCell();
    if (!cell) return false;
    grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    return { r: cell.r, c: cell.c, value: grid[cell.r][cell.c], isNew: true };
  }

  function updateBest() {
    if (score > best) {
      best = score;
      localStorage.setItem(BEST_KEY, String(best));
    }
    bestEl.textContent = best;
  }

  function updateScore() {
    scoreEl.textContent = score;
    updateBest();
  }

  function measureBoard() {
    const w = boardEl.clientWidth || boardEl.getBoundingClientRect().width;
    const inner = Math.max(w - padding * 2, 280);
    gap = 10;
    cellSize = (inner - gap * (SIZE - 1)) / SIZE;
  }

  function buildBoardDOM() {
    boardEl.innerHTML = "";
    for (let i = 0; i < SIZE * SIZE; i++) {
      const cell = document.createElement("div");
      cell.className = "cell-bg";
      boardEl.appendChild(cell);
    }
    tilesLayer = document.createElement("div");
    tilesLayer.className = "tiles-layer";
    boardEl.appendChild(tilesLayer);
    measureBoard();
  }

  function tilePosition(r, c) {
    return {
      left: c * (cellSize + gap),
      top: r * (cellSize + gap),
    };
  }

  function renderTiles(animHints) {
    measureBoard();
    tilesLayer.innerHTML = "";
    const hints = animHints || { newCells: [], mergedCells: [] };

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const value = grid[r][c];
        if (value === 0) continue;

        const pos = tilePosition(r, c);
        const tile = document.createElement("div");
        tile.className = `tile ${tileClass(value)}`;
        tile.style.width = `${cellSize}px`;
        tile.style.height = `${cellSize}px`;
        tile.style.left = `${pos.left}px`;
        tile.style.top = `${pos.top}px`;

        const isNew = hints.newCells.some((x) => x.r === r && x.c === c);
        if (isNew) tile.classList.add("new");

        const inner = document.createElement("div");
        inner.className = "tile-inner";

        const valSpan = document.createElement("span");
        valSpan.className = "tile-value";
        valSpan.textContent = formatValue(value);
        inner.appendChild(valSpan);

        const face = getFace(value);
        if (face) {
          const faceSpan = document.createElement("span");
          faceSpan.className = "tile-face";
          faceSpan.textContent = face;
          inner.appendChild(faceSpan);
        }

        tile.appendChild(inner);
        tilesLayer.appendChild(tile);
      }
    }
  }

  function move(direction) {
    const { grid: next, score: gained, moved } = moveGrid(grid, direction);
    if (!moved) return false;

    grid = next;
    score += gained;

    const spawned = addRandomTile();
    const newCells = spawned ? [{ r: spawned.r, c: spawned.c }] : [];

    updateScore();
    renderTiles({ newCells, mergedCells: [] });
    checkGameState();
    return true;
  }

  function showOverlay(type) {
    overlayEl.classList.remove("hidden");
    btnContinue.classList.add("hidden");

    if (type === "win") {
      overlayEmoji.textContent = "🎉";
      overlayTitle.textContent = "太棒啦！";
      overlayMsg.textContent = "你合成了 2048！要继续挑战更高分吗？";
      btnContinue.classList.remove("hidden");
    } else {
      overlayEmoji.textContent = "🥺";
      overlayTitle.textContent = "游戏结束";
      overlayMsg.textContent = `本次得分 ${score}，再试一次吧！`;
    }
  }

  function hideOverlay() {
    overlayEl.classList.add("hidden");
  }

  function checkGameState() {
    if (!won && !keepPlaying && hasWon(grid)) {
      won = true;
      showOverlay("win");
      return;
    }
    if (!canMove(grid)) {
      showOverlay("lose");
    }
  }

  function newGame() {
    grid = emptyGrid();
    score = 0;
    won = false;
    keepPlaying = false;
    hideOverlay();
    updateScore();
    addRandomTile();
    addRandomTile();
    renderTiles({ newCells: [], mergedCells: [] });
  }

  function handleKey(e) {
    if (!overlayEl.classList.contains("hidden") && e.key !== "Enter") {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
      }
      return;
    }

    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      a: "left",
      d: "right",
      w: "up",
      s: "down",
    };

    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    move(dir);
  }

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;

    const minSwipe = 30;
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  }

  btnNew.addEventListener("click", newGame);
  btnRetry.addEventListener("click", newGame);
  btnContinue.addEventListener("click", () => {
    keepPlaying = true;
    hideOverlay();
  });

  document.addEventListener("keydown", handleKey);
  boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
  boardEl.addEventListener("touchend", handleTouchEnd, { passive: true });
  window.addEventListener("resize", () => renderTiles());

  function init() {
    bestEl.textContent = best;
    buildBoardDOM();
    newGame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(init));
  } else {
    requestAnimationFrame(init);
  }
})();
