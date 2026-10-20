/* 系统设置页：登录方式、密码策略、基本信息。 */
function showPanel(id) {
  document.querySelectorAll(".config-sidebar-item").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("data-panel") === id);
  });
  document.querySelectorAll(".config-panel").forEach(function (panel) {
    panel.classList.toggle("active", panel.id === "panel-" + id);
  });
}

function setSwitch(id, on) {
  var button = document.getElementById(id);
  button.classList.toggle("on", on);
  button.setAttribute("aria-pressed", on ? "true" : "false");
}

function fillSettings() {
  var data = readSettings();
  setSwitch("switch-account", true);
  setSwitch("switch-captcha", data.captcha);
  setSwitch("switch-mixed", data.passwordMixed);
  setSwitch("switch-must-change", data.mustChange);
  document.getElementById("lock-after").value = data.lockAfter;
  document.getElementById("password-min").value = data.passwordMin;
  document.getElementById("password-hint").value = data.passwordHint;
  document.getElementById("system-name").value = (window.BRAND && window.BRAND.name) || "管理系统";
}

function saveSettings() {
  writeSettings({
    captcha: document.getElementById("switch-captcha").classList.contains("on"),
    lockAfter: Number(document.getElementById("lock-after").value) || 5,
    passwordMin: Number(document.getElementById("password-min").value) || 8,
    passwordMixed: document.getElementById("switch-mixed").classList.contains("on"),
    mustChange: document.getElementById("switch-must-change").classList.contains("on"),
    passwordHint: document.getElementById("password-hint").value.trim()
  });
  var feedback = document.getElementById("settings-feedback");
  feedback.textContent = "已保存在本页示例中。登录页会按这里的验证码开关显示。";
  feedback.hidden = false;
}

document.querySelectorAll(".config-sidebar-item").forEach(function (item) {
  item.addEventListener("click", function () { showPanel(item.getAttribute("data-panel")); });
});
document.querySelectorAll(".switch[data-toggle]").forEach(function (button) {
  button.addEventListener("click", function () {
    if (button.disabled) return;
    setSwitch(button.id, !button.classList.contains("on"));
  });
});
document.getElementById("settings-save").addEventListener("click", saveSettings);
fillSettings();
