# 登录界面

简约登录页 + 可执行测试用例。

## 运行页面

浏览器打开 `index.html`，演示账号：`admin` / `123456`

## 运行测试

```bash
cd login-page
node --test test_login.mjs
```

## 文件

| 文件 | 说明 |
|------|------|
| `login-core.js` | 校验逻辑 |
| `login.js` | 页面交互 |
| `test_login.mjs` | 自动化测试 |
| `TEST_CASES.md` | 完整测试用例文档（含手工用例） |
