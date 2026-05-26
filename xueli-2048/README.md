# 雪梨 2048

简约可爱风格的 2048 小游戏（含历史分数排名）。

## 如何运行

直接用浏览器打开 `index.html` 即可。

```bash
cd xueli-2048
# 可选：python -m http.server 8080
```

## 功能

- 游戏名称：雪梨 2048
- 历史分数排名：每局结束后自动记录，按分数从高到低展示

## 运行测试

```bash
cd xueli-2048
node --test test_game_core.mjs
node --test test_game_history.mjs
```

## 文件结构

```
xueli-2048/
├── index.html
├── style.css
├── game-core.js
├── game-history.js
├── game.js
├── test_game_core.mjs
├── test_game_history.mjs
└── README.md
```

> 初版游戏在 `game-2048/` 文件夹（萌萌 2048）。
