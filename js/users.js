/* 用户页：查询、新增、编辑、重置密码、启用和停用。 */
var users = [
  { username: "admin", displayName: "管理员", phone: "13800001001", roleId: "admin", enabled: true },
  { username: "operator", displayName: "操作员", phone: "13800001002", roleId: "operator", enabled: true },
  { username: "viewer", displayName: "查阅员", phone: "13800001003", roleId: "viewer", enabled: false }
];
var roleNames = { admin: "系统管理员", operator: "操作员", viewer: "查阅员" };
var filteredUsers = users.slice();
var editingAccount = "";
var pendingAction = null;

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
  });
}

function showBox(id, message) {
  var box = document.getElementById(id);
  if (!box) return;
  box.style.display = message ? "flex" : "none";
  box.textContent = message || "";
}

function renderUsers() {
  var tbody = document.getElementById("user-list");
  var empty = document.getElementById("empty-msg");
  var table = document.getElementById("user-table");
  tbody.innerHTML = "";
  if (!filteredUsers.length) {
    empty.style.display = "flex";
    table.style.display = "none";
    return;
  }
  empty.style.display = "none";
  table.style.display = "";
  filteredUsers.forEach(function (user, index) {
    var status = user.enabled ? '<span class="tag tag-success">启用</span>' : '<span class="tag tag-error">停用</span>';
    var toggle = user.username === "admin" ? "" : '<button type="button" class="btn btn-text btn-sm" data-act="toggle">' + (user.enabled ? "停用" : "启用") + "</button>";
    var tr = document.createElement("tr");
    tr.innerHTML = '<td class="col-index">' + (index + 1) + "</td><td>" + escapeHtml(user.username) + "</td><td>" + escapeHtml(user.displayName) + "</td><td>" + escapeHtml(user.phone || "-") + "</td><td>" + escapeHtml(roleNames[user.roleId] || "") + "</td><td>" + status + '</td><td class="col-action"><button type="button" class="btn btn-text btn-sm" data-act="edit">编辑</button><button type="button" class="btn btn-text btn-sm" data-act="reset">重置密码</button>' + toggle + "</td>";
    tr.querySelector('[data-act="edit"]').addEventListener("click", function () { openUserEdit(user.username); });
    tr.querySelector('[data-act="reset"]').addEventListener("click", function () { openUserAction("reset", user.username); });
    var toggleBtn = tr.querySelector('[data-act="toggle"]');
    if (toggleBtn) toggleBtn.addEventListener("click", function () { openUserAction(user.enabled ? "disable" : "enable", user.username); });
    tbody.appendChild(tr);
  });
}

function searchUsers() {
  var account = document.getElementById("q-account").value.trim();
  var name = document.getElementById("q-name").value.trim();
  var roleId = document.getElementById("q-role").value;
  var status = document.getElementById("q-status").value;
  filteredUsers = users.filter(function (user) {
    if (account && user.username.indexOf(account) < 0) return false;
    if (name && user.displayName.indexOf(name) < 0) return false;
    if (roleId && user.roleId !== roleId) return false;
    if (status === "1" && !user.enabled) return false;
    if (status === "0" && user.enabled) return false;
    return true;
  });
  renderUsers();
}

function resetUserFilter() {
  document.getElementById("q-account").value = "";
  document.getElementById("q-name").value = "";
  document.getElementById("q-role").value = "";
  document.getElementById("q-status").value = "";
  filteredUsers = users.slice();
  renderUsers();
}

function openUserCreate() {
  editingAccount = "";
  document.getElementById("user-modal-title").textContent = "新增用户";
  document.getElementById("f-username").readOnly = false;
  document.getElementById("f-username").value = "";
  document.getElementById("f-name").value = "";
  document.getElementById("f-phone").value = "";
  document.getElementById("f-role").value = "operator";
  document.getElementById("f-role").disabled = false;
  document.getElementById("init-pwd-note").style.display = "";
  showBox("modal-error", "");
  openModal("user-modal");
}

function openUserEdit(username) {
  var user = users.find(function (item) { return item.username === username; });
  if (!user) return;
  editingAccount = user.username;
  document.getElementById("user-modal-title").textContent = "编辑用户";
  document.getElementById("f-username").readOnly = true;
  document.getElementById("f-username").value = user.username;
  document.getElementById("f-name").value = user.displayName;
  document.getElementById("f-phone").value = user.phone;
  document.getElementById("f-role").value = user.roleId;
  document.getElementById("f-role").disabled = user.username === "admin";
  document.getElementById("init-pwd-note").style.display = "none";
  showBox("modal-error", "");
  openModal("user-modal");
}

function submitUser(event) {
  event.preventDefault();
  var account = document.getElementById("f-username").value.trim();
  var name = document.getElementById("f-name").value.trim();
  var phone = document.getElementById("f-phone").value.trim();
  var roleId = document.getElementById("f-role").value;
  if (!editingAccount && !/^[A-Za-z0-9]{4,32}$/.test(account)) {
    showBox("modal-error", "登录账号为 4 到 32 位字母或数字");
    return false;
  }
  if (!name) {
    showBox("modal-error", "请填写姓名");
    return false;
  }
  if (!editingAccount && users.some(function (item) { return item.username === account; })) {
    showBox("modal-error", "登录账号已存在");
    return false;
  }
  if (editingAccount) {
    var current = users.find(function (item) { return item.username === editingAccount; });
    current.displayName = name;
    current.phone = phone;
    if (current.username !== "admin") current.roleId = roleId;
  } else {
    users.push({ username: account, displayName: name, phone: phone, roleId: roleId, enabled: true });
  }
  closeModal("user-modal");
  searchUsers();
  return false;
}

function openUserAction(kind, username) {
  pendingAction = { kind: kind, username: username };
  var title = document.getElementById("action-title");
  var body = document.getElementById("action-body");
  var ok = document.getElementById("action-ok");
  document.getElementById("action-cancel").style.display = "";
  ok.textContent = "确定";
  if (kind === "reset") {
    title.textContent = "重置密码";
    body.textContent = "确定重置「" + username + "」的密码吗？重置后该账号需要重新登录并修改密码。";
    ok.textContent = "重置密码";
  } else if (kind === "disable") {
    title.textContent = "停用用户";
    body.textContent = "确定停用用户「" + username + "」吗？停用后该账号不能继续使用。";
    ok.textContent = "停用";
  } else {
    title.textContent = "启用用户";
    body.textContent = "确定启用用户「" + username + "」吗？";
    ok.textContent = "启用";
  }
  showBox("action-error", "");
  openModal("action-modal");
}

function confirmUserAction() {
  if (!pendingAction) return;
  var user = users.find(function (item) { return item.username === pendingAction.username; });
  if (!user) return;
  if (pendingAction.kind === "reset") {
    document.getElementById("action-title").textContent = "重置密码";
    document.getElementById("action-body").textContent = "已在本页示例中重置。初始密码请在接入账号服务后由服务返回。";
    document.getElementById("action-cancel").style.display = "none";
    document.getElementById("action-ok").textContent = "确定";
    pendingAction.kind = "done";
    return;
  }
  if (pendingAction.kind === "done") {
    closeModal("action-modal");
    pendingAction = null;
    return;
  }
  user.enabled = pendingAction.kind === "enable";
  closeModal("action-modal");
  pendingAction = null;
  searchUsers();
}

renderUsers();
