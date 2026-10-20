/* 登录方式和密码策略。只保存在当前浏览器会话。 */
var SETTINGS_KEY = "console-settings";

function defaultSettings() {
  return {
    accountLogin: true,
    captcha: true,
    lockAfter: 5,
    passwordMin: 8,
    passwordMixed: true,
    mustChange: true,
    passwordHint: "至少 8 位，并包含字母和数字"
  };
}

function readSettings() {
  var base = defaultSettings();
  try {
    var raw = sessionStorage.getItem(SETTINGS_KEY);
    if (!raw) return base;
    var saved = JSON.parse(raw);
    Object.keys(base).forEach(function (key) {
      if (saved[key] !== undefined) base[key] = saved[key];
    });
  } catch (error) {
    return defaultSettings();
  }
  base.accountLogin = true;
  return base;
}

function writeSettings(data) {
  var next = defaultSettings();
  Object.keys(next).forEach(function (key) {
    if (data[key] !== undefined) next[key] = data[key];
  });
  next.accountLogin = true;
  sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}
