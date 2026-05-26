(function () {
  "use strict";

  const { validateLogin } = window.LoginCore;

  const form = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const messageEl = document.getElementById("message");

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message " + (type || "");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = validateLogin(usernameInput.value, passwordInput.value);
    if (result.ok) {
      showMessage(result.message + "，欢迎你，" + result.username + "！", "success");
    } else {
      showMessage(result.message, "error");
    }
  });
})();
