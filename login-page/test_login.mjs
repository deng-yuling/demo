/**
 * 登录界面测试用例
 * 运行: node --test test_login.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadLoginCore } from "./test/load-login-core.mjs";

const { validateLogin, DEMO_USER, DEMO_PASS, ERROR } = loadLoginCore();

describe("validateLogin - 空值校验", () => {
  it("用户名为空时应失败", () => {
    const r = validateLogin("", "123456");
    assert.equal(r.ok, false);
    assert.equal(r.code, "EMPTY_USER");
    assert.equal(r.message, ERROR.EMPTY_USER);
  });

  it("密码为空时应失败", () => {
    const r = validateLogin("admin", "");
    assert.equal(r.ok, false);
    assert.equal(r.code, "EMPTY_PASS");
  });

  it("用户名和密码都为空时应失败", () => {
    const r = validateLogin("", "");
    assert.equal(r.ok, false);
    assert.equal(r.code, "EMPTY_USER");
  });

  it("null/undefined 应视为空", () => {
    assert.equal(validateLogin(null, "123456").code, "EMPTY_USER");
    assert.equal(validateLogin("admin", undefined).code, "EMPTY_PASS");
  });
});

describe("validateLogin - 长度校验", () => {
  it("用户名过短应失败", () => {
    const r = validateLogin("ab", "123456");
    assert.equal(r.ok, false);
    assert.equal(r.code, "USER_TOO_SHORT");
  });

  it("密码过短应失败", () => {
    const r = validateLogin("admin", "12345");
    assert.equal(r.ok, false);
    assert.equal(r.code, "PASS_TOO_SHORT");
  });

  it("用户名恰好 3 位且密码 6 位格式应通过长度检查", () => {
    const r = validateLogin("abc", "123456");
    assert.notEqual(r.code, "USER_TOO_SHORT");
    assert.notEqual(r.code, "PASS_TOO_SHORT");
  });
});

describe("validateLogin - 凭证校验", () => {
  it("错误用户名应失败", () => {
    const r = validateLogin("wrong", DEMO_PASS);
    assert.equal(r.ok, false);
    assert.equal(r.code, "INVALID");
    assert.equal(r.message, ERROR.INVALID);
  });

  it("错误密码应失败", () => {
    const r = validateLogin(DEMO_USER, "wrongpass");
    assert.equal(r.ok, false);
    assert.equal(r.code, "INVALID");
  });

  it("正确账号密码应成功", () => {
    const r = validateLogin(DEMO_USER, DEMO_PASS);
    assert.equal(r.ok, true);
    assert.equal(r.code, "SUCCESS");
    assert.equal(r.username, DEMO_USER);
    assert.equal(r.message, ERROR.SUCCESS);
  });
});

describe("validateLogin - 边界与格式", () => {
  it("用户名前后空格应被 trim", () => {
    const r = validateLogin("  admin  ", DEMO_PASS);
    assert.equal(r.ok, true);
    assert.equal(r.username, "admin");
  });

  it("密码不应 trim（末尾空格算不同密码）", () => {
    const r = validateLogin(DEMO_USER, DEMO_PASS + " ");
    assert.equal(r.ok, false);
    assert.equal(r.code, "INVALID");
  });

  it("用户名大小写敏感", () => {
    const r = validateLogin("Admin", DEMO_PASS);
    assert.equal(r.ok, false);
    assert.equal(r.code, "INVALID");
  });
});

describe("validateLogin - 用例矩阵（常见场景）", () => {
  const cases = [
    { user: "", pass: "", expectOk: false, expectCode: "EMPTY_USER", desc: "全空" },
    { user: "admin", pass: "", expectOk: false, expectCode: "EMPTY_PASS", desc: "缺密码" },
    { user: "", pass: "123456", expectOk: false, expectCode: "EMPTY_USER", desc: "缺用户名" },
    { user: "admin", pass: "123456", expectOk: true, expectCode: "SUCCESS", desc: "正确登录" },
    { user: "admin", pass: "000000", expectOk: false, expectCode: "INVALID", desc: "密码错误" },
    { user: "root", pass: "123456", expectOk: false, expectCode: "INVALID", desc: "用户错误" },
  ];

  for (const c of cases) {
    it(c.desc, () => {
      const r = validateLogin(c.user, c.pass);
      assert.equal(r.ok, c.expectOk, `场景「${c.desc}」ok 不符`);
      assert.equal(r.code, c.expectCode, `场景「${c.desc}」code 不符`);
    });
  }
});
