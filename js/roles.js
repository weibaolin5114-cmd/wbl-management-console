var catalog = [
  { id: "dashboard", label: "概览", buttons: [] },
  { id: "list", label: "列表", buttons: [{ id: "list.create", label: "新增" }, { id: "list.edit", label: "编辑" }, { id: "list.delete", label: "删除" }] },
  { id: "logs", label: "操作日志", buttons: [] },
  { id: "settings", label: "系统设置", buttons: [{ id: "settings.save", label: "保存" }] },
  { id: "users", label: "用户管理", buttons: [{ id: "user.create", label: "新增" }, { id: "user.edit", label: "编辑" }, { id: "user.reset", label: "重置密码" }, { id: "user.disable", label: "启用停用" }] },
  { id: "roles", label: "角色管理", buttons: [{ id: "role.create", label: "新增" }, { id: "role.edit", label: "编辑" }, { id: "role.delete", label: "删除" }] }
];
var roles = [
  { id: "admin", name: "系统管理员", code: "ADMIN", builtin: true, menus: catalog.map(function (item) { return item.id; }), buttons: catalog.reduce(function (all, item) { return all.concat(item.buttons.map(function (btn) { return btn.id; })); }, []) },
  { id: "operator", name: "操作员", code: "OPERATOR", builtin: false, menus: ["dashboard", "list", "logs"], buttons: ["list.create", "list.edit"] },
  { id: "viewer", name: "查阅员", code: "VIEWER", builtin: false, menus: ["dashboard", "list"], buttons: [] }
];
var selectedRoleId = "admin";
var roleDirty = false;
var pendingRoleSwitch = "";

function escapeRole(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
  });
}

function currentRole() {
  return roles.find(function (item) { return item.id === selectedRoleId; });
}

function renderRoleList() {
  var box = document.getElementById("role-list");
  box.innerHTML = "";
  roles.forEach(function (role) {
    var item = document.createElement("div");
    item.className = "role-item" + (role.id === selectedRoleId ? " active" : "");
    item.innerHTML = '<div><div class="role-item-name">' + escapeRole(role.name) + '</div><div class="role-item-code">' + escapeRole(role.code) + '</div></div><div class="role-item-meta">' + (role.builtin ? '<span class="tag tag-primary">内置</span>' : '<span class="tag">自定义</span>') + "</div>";
    item.addEventListener("click", function () {
      if (role.id === selectedRoleId) return;
      if (roleDirty) {
        pendingRoleSwitch = role.id;
        openModal("role-switch-modal");
        return;
      }
      selectedRoleId = role.id;
      renderRoleList();
      renderRoleDetail();
    });
    box.appendChild(item);
  });
}

function renderRoleDetail() {
  var role = currentRole();
  var panel = document.getElementById("role-detail");
  if (!role) {
    panel.innerHTML = '<div class="role-empty">请选择左侧角色</div>';
    return;
  }
  var locked = role.id === "admin";
  panel.innerHTML = '<div class="role-detail-header"><div><div class="role-detail-title">' + escapeRole(role.name) + '</div><div class="role-detail-sub"><span class="role-item-code">' + escapeRole(role.code) + "</span>" + (role.builtin ? '<span class="tag tag-primary">内置</span>' : '<span class="tag">自定义</span>') + '</div></div><div style="display:flex;gap:8px;">' + (role.builtin ? "" : '<button type="button" class="btn btn-danger btn-sm" id="role-delete">删除</button>') + '<button type="button" class="btn btn-primary btn-sm" id="role-save">保存</button></div></div><div class="role-section"><div class="role-section-title">基本信息</div><div class="role-form-grid"><div class="form-item" style="margin:0"><label class="form-label"><span class="required">*</span>角色名称</label><input class="input" id="detail-name" maxlength="32" value="' + escapeRole(role.name) + '"></div><div class="form-item" style="margin:0"><label class="form-label"><span class="required">*</span>角色编码</label><input class="input" id="detail-code" maxlength="32" value="' + escapeRole(role.code) + '"' + (role.builtin ? " disabled" : "") + '></div></div></div><div class="role-section"><div class="role-section-title">菜单与操作权限</div><div class="perm-matrix" id="perm-matrix"></div></div>';
  var matrix = document.getElementById("perm-matrix");
  catalog.forEach(function (menu) {
    var checked = role.menus.indexOf(menu.id) >= 0 || locked;
    var row = document.createElement("div");
    row.className = "perm-row";
    row.innerHTML = '<label class="perm-row-menu"><input type="checkbox" class="menu-check" value="' + menu.id + '"' + (checked ? " checked" : "") + (locked ? " disabled" : "") + "> " + escapeRole(menu.label) + "</label>" + (menu.buttons.length ? '<div class="perm-row-body"></div><button type="button" class="btn btn-text btn-sm">全选</button>' : "");
    var body = row.querySelector(".perm-row-body");
    if (body) {
      menu.buttons.forEach(function (btn) {
        var on = role.buttons.indexOf(btn.id) >= 0 || locked;
        var label = document.createElement("label");
        label.className = "perm-chip";
        label.innerHTML = '<input type="checkbox" class="btn-check" value="' + btn.id + '"' + (on ? " checked" : "") + (locked || !checked ? " disabled" : "") + "> " + escapeRole(btn.label);
        body.appendChild(label);
      });
      row.querySelector("button").addEventListener("click", function () {
        body.querySelectorAll("input").forEach(function (input) { if (!input.disabled) input.checked = true; });
        roleDirty = true;
      });
    }
    row.querySelector(".menu-check").addEventListener("change", function (event) {
      roleDirty = true;
      row.querySelectorAll(".btn-check").forEach(function (input) {
        input.disabled = locked || !event.target.checked;
        if (!event.target.checked) input.checked = false;
      });
    });
    row.querySelectorAll(".btn-check").forEach(function (input) {
      input.addEventListener("change", function () { roleDirty = true; });
    });
    matrix.appendChild(row);
  });
  document.getElementById("detail-name").addEventListener("input", function () { roleDirty = true; });
  var codeInput = document.getElementById("detail-code");
  if (!codeInput.disabled) codeInput.addEventListener("input", function () { roleDirty = true; });
  document.getElementById("role-save").addEventListener("click", saveRole);
  var deleteBtn = document.getElementById("role-delete");
  if (deleteBtn) deleteBtn.addEventListener("click", function () { openModal("role-delete-modal"); });
}

function saveRole() {
  var role = currentRole();
  var name = document.getElementById("detail-name").value.trim();
  var code = document.getElementById("detail-code").value.trim();
  if (!name || !code) return;
  role.name = name;
  if (!role.builtin) role.code = code.toUpperCase();
  if (role.id !== "admin") {
    role.menus = Array.prototype.map.call(document.querySelectorAll(".menu-check:checked"), function (input) { return input.value; });
    role.buttons = Array.prototype.map.call(document.querySelectorAll(".btn-check:checked"), function (input) { return input.value; });
  }
  roleDirty = false;
  renderRoleList();
  renderRoleDetail();
}

function confirmRoleSwitch() {
  selectedRoleId = pendingRoleSwitch;
  roleDirty = false;
  closeModal("role-switch-modal");
  renderRoleList();
  renderRoleDetail();
}

function createRole(event) {
  event.preventDefault();
  var name = document.getElementById("create-name").value.trim();
  var code = document.getElementById("create-code").value.trim().toUpperCase();
  if (!name || !/^[A-Z][A-Z0-9_]{1,31}$/.test(code)) return false;
  if (roles.some(function (item) { return item.code === code; })) return false;
  var id = "role-" + Date.now();
  roles.push({ id: id, name: name, code: code, builtin: false, menus: ["dashboard"], buttons: [] });
  selectedRoleId = id;
  roleDirty = false;
  closeModal("role-modal");
  renderRoleList();
  renderRoleDetail();
  return false;
}

function deleteRole() {
  roles = roles.filter(function (item) { return item.id !== selectedRoleId; });
  selectedRoleId = roles[0] ? roles[0].id : "";
  roleDirty = false;
  closeModal("role-delete-modal");
  renderRoleList();
  renderRoleDetail();
}

renderRoleList();
renderRoleDetail();
