/**
 * 登录校验逻辑（无 DOM）
 * 浏览器：window.LoginCore
 */
(function (global) {
  "use strict";

  const DEMO_USER = "admin";
  const DEMO_PASS = "123456";
  const MIN_USER_LEN = 3;
  const MIN_PASS_LEN = 6;

  const ERROR = {
    EMPTY_USER: "请输入用户名",
    EMPTY_PASS: "请输入密码",
    USER_TOO_SHORT: `用户名至少 ${MIN_USER_LEN} 个字符`,
    PASS_TOO_SHORT: `密码至少 ${MIN_PASS_LEN} 个字符`,
    INVALID: "用户名或密码错误",
    SUCCESS: "登录成功",
  };

  function validateLogin(username, password) {
    const user = String(username ?? "").trim();
    const pass = String(password ?? "");

    if (!user) {
      return { ok: false, code: "EMPTY_USER", message: ERROR.EMPTY_USER };
    }
    if (!pass) {
      return { ok: false, code: "EMPTY_PASS", message: ERROR.EMPTY_PASS };
    }
    if (user.length < MIN_USER_LEN) {
      return { ok: false, code: "USER_TOO_SHORT", message: ERROR.USER_TOO_SHORT };
    }
    if (pass.length < MIN_PASS_LEN) {
      return { ok: false, code: "PASS_TOO_SHORT", message: ERROR.PASS_TOO_SHORT };
    }
    if (user !== DEMO_USER || pass !== DEMO_PASS) {
      return { ok: false, code: "INVALID", message: ERROR.INVALID };
    }
    return { ok: true, code: "SUCCESS", message: ERROR.SUCCESS, username: user };
  }

  global.LoginCore = {
    DEMO_USER,
    DEMO_PASS,
    MIN_USER_LEN,
    MIN_PASS_LEN,
    ERROR,
    validateLogin,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
