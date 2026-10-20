/* 侧栏菜单和顶栏。改菜单文字改 label，改打开的页面改 href。 */
var MENU = [
  { id: "dashboard", href: "index.html", label: "概览", icon: '<rect x="2.2" y="2.2" width="5.6" height="5.6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="10.2" y="2.2" width="5.6" height="5.6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="2.2" y="10.2" width="5.6" height="5.6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="10.2" y="10.2" width="5.6" height="5.6" rx="1" stroke="currentColor" stroke-width="1.4"/>' },
  { id: "list", href: "list.html", label: "列表", icon: '<path d="M4 4.5h10M4 9h10M4 13.5h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "form", href: "form.html", label: "表单", icon: '<path d="M5 2.5h5.2L14 6.2V15.5H5V2.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 2.8V6.2h3.2M7 9.2h4M7 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "detail", href: "detail.html", label: "详情", icon: '<rect x="3" y="3" width="12" height="12" rx="1.4" stroke="currentColor" stroke-width="1.4"/><path d="M6 7h6M6 10h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "logs", href: "logs.html", label: "操作日志", icon: '<path d="M5 2.5h8v13H5V2.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M7.2 6h3.6M7.2 9h3.6M7.2 12h2.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "settings", href: "settings.html", label: "系统设置", icon: '<circle cx="9" cy="9" r="2.1" stroke="currentColor" stroke-width="1.4"/><path d="M9 2.4v1.8M9 13.8v1.8M2.4 9h1.8M13.8 9h1.8M4.3 4.3l1.3 1.3M12.4 12.4l1.3 1.3M13.7 4.3l-1.3 1.3M5.6 12.4l-1.3 1.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "users", href: "users.html", label: "用户管理", icon: '<circle cx="7" cy="6.2" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M3.2 14.2c.5-2.2 2-3.4 3.8-3.4s3.3 1.2 3.8 3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="12.2" cy="6.6" r="1.6" stroke="currentColor" stroke-width="1.4"/><path d="M12 10.8c1.5.1 2.6 1 3.1 2.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id: "roles", href: "roles.html", label: "角色管理", icon: '<path d="M9 2.2 14.5 4.4v4.2c0 3.2-2.2 5.4-5.5 6.6-3.3-1.2-5.5-3.4-5.5-6.6V4.4L9 2.2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' }
];

function iconSvg(path) {
  return '<svg class="menu-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' + path + "</svg>";
}

function renderChrome() {
  var page = document.body.getAttribute("data-page") || "";
  var sidebar = document.getElementById("sidebar");
  var header = document.getElementById("header");
  if (sidebar) {
    var items = MENU.map(function (item) {
      var active = item.id === page ? " active" : "";
      return '<a class="menu-item' + active + '" href="' + item.href + '">' + iconSvg(item.icon) + '<span class="menu-label">' + item.label + "</span></a>";
    }).join("");
    sidebar.innerHTML = '<div class="sidebar-logo"><span class="brand-mark" data-brand-mark></span><span class="sidebar-logo-text" data-brand-name></span></div><nav class="sidebar-menu">' + items + "</nav>";
  }
  if (header && !header.childElementCount) {
    header.innerHTML = '<button class="collapse-btn" type="button" onclick="toggleSidebar()" aria-label="收起侧栏"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>'
      + '<div class="header-right"><div class="dropdown" id="userDropdown"><div class="header-user" onclick="toggleDropdown(\'userDropdown\')"><div class="header-avatar" data-brand-avatar></div><span data-brand-user></span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
      + '<div class="dropdown-menu"><div class="dropdown-item" onclick="openPasswordModal()">修改密码</div><div class="dropdown-divider"></div><div class="dropdown-item danger" onclick="openModal(\'logout-modal\')">退出登录</div></div></div></div>';
  }
  if (!document.getElementById("logout-modal")) {
    var holder = document.createElement("div");
    holder.innerHTML = '<div id="logout-modal" class="modal-overlay" role="dialog" aria-modal="true"><div class="modal modal-sm"><div class="modal-header"><span class="modal-title">退出登录</span><button class="modal-close" type="button" onclick="closeModal(\'logout-modal\')" aria-label="关闭">×</button></div><div class="modal-body">确定退出当前账号吗？</div><div class="modal-footer"><button class="btn" type="button" onclick="closeModal(\'logout-modal\')">取消</button><a class="btn btn-primary" href="login.html">退出登录</a></div></div></div>'
      + '<div id="password-modal" class="modal-overlay" role="dialog" aria-modal="true"><div class="modal modal-sm"><div class="modal-header"><span class="modal-title">修改密码</span><button class="modal-close" type="button" onclick="closeModal(\'password-modal\')" aria-label="关闭">×</button></div><div class="modal-body"><div id="password-step-old"><div class="form-item" style="margin-bottom:0"><label class="form-label" for="pwd-old">当前密码</label><input class="input" id="pwd-old" type="password" autocomplete="current-password"></div></div><div id="password-step-new" hidden><div class="form-item"><label class="form-label" for="pwd-new">新密码</label><input class="input" id="pwd-new" type="password" autocomplete="new-password"></div><div class="form-item" style="margin-bottom:0"><label class="form-label" for="pwd-confirm">确认新密码</label><input class="input" id="pwd-confirm" type="password" autocomplete="new-password"></div></div><div class="form-error" id="password-error"></div></div><div class="modal-footer"><button class="btn" type="button" onclick="closeModal(\'password-modal\')">取消</button><button class="btn btn-primary" type="button" id="password-next" onclick="verifyOldPassword()">下一步</button><button class="btn btn-primary" type="button" id="password-save" onclick="submitNewPassword()" hidden>确认修改</button></div></div></div>';
    while (holder.firstChild) document.body.appendChild(holder.firstChild);
  }
}

renderChrome();
