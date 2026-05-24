/**
 * 历史对局分数存储与排名
 * 浏览器：挂载到 window.Game2048History
 */
(function (global) {
  "use strict";

  const HISTORY_KEY = "xueli2048_history";
  const MAX_RECORDS = 100;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function saveHistory(list) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(-MAX_RECORDS)));
  }

  function addGameRecord(score) {
    if (score <= 0) return null;
    const history = loadHistory();
    const record = {
      score,
      gameNo: history.length + 1,
      playedAt: Date.now(),
    };
    history.push(record);
    saveHistory(history);
    return record;
  }

  function getRankedHistory() {
    const history = loadHistory();
    return [...history]
      .sort((a, b) => b.score - a.score || a.gameNo - b.gameNo)
      .map((item, rank) => ({ ...item, rank: rank + 1 }));
  }

  function formatPlayedAt(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  global.Game2048History = {
    HISTORY_KEY,
    loadHistory,
    saveHistory,
    addGameRecord,
    getRankedHistory,
    formatPlayedAt,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
