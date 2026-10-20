function applyBrand() {
  var brand = window.BRAND || {};
  var name = brand.name || "管理系统";
  var userName = brand.userName || "管理员";
  document.querySelectorAll("[data-brand-name]").forEach(function (el) {
    el.textContent = name;
  });
  document.querySelectorAll("[data-brand-user]").forEach(function (el) {
    el.textContent = userName;
  });
  document.querySelectorAll("[data-brand-avatar]").forEach(function (el) {
    el.textContent = userName.slice(0, 1);
  });
  document.querySelectorAll("[data-brand-mark]").forEach(function (el) {
    el.replaceChildren();
    if (brand.logo) {
      var img = document.createElement("img");
      img.src = brand.logo;
      img.alt = "";
      el.appendChild(img);
      el.classList.remove("is-empty");
    } else {
      el.classList.add("is-empty");
    }
  });
  var pageTitle = document.body.getAttribute("data-page-title");
  if (pageTitle) document.title = name + " - " + pageTitle;
}

function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  var layout = document.getElementById("layout");
  if (!sidebar || !layout) return;
  sidebar.classList.toggle("collapsed");
  layout.classList.toggle("sidebar-collapsed");
}

function toggleDropdown(id) {
  var node = document.getElementById(id);
  if (node) node.classList.toggle("open");
}

function openModal(id) {
  var dropdown = document.getElementById("userDropdown");
  if (dropdown) dropdown.classList.remove("open");
  var modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
}

function showPasswordStep(step) {
  var oldStep = document.getElementById("password-step-old");
  var newStep = document.getElementById("password-step-new");
  var next = document.getElementById("password-next");
  var save = document.getElementById("password-save");
  if (oldStep) oldStep.hidden = step !== "old";
  if (newStep) newStep.hidden = step !== "new";
  if (next) next.hidden = step !== "old";
  if (save) save.hidden = step !== "new";
}

function openPasswordModal() {
  showPasswordStep("old");
  var error = document.getElementById("password-error");
  if (error) error.textContent = "";
  openModal("password-modal");
}

function verifyOldPassword() {
  var input = document.getElementById("pwd-old");
  var error = document.getElementById("password-error");
  if (!input || !input.value) {
    if (error) error.textContent = "请填写当前密码";
    return;
  }
  if (error) error.textContent = "";
  showPasswordStep("new");
}

function submitNewPassword() {
  var created = document.getElementById("pwd-new");
  var confirm = document.getElementById("pwd-confirm");
  var error = document.getElementById("password-error");
  if (!created || !created.value || created.value !== (confirm ? confirm.value : "")) {
    if (error) error.textContent = "请填写并确认新密码";
    return;
  }
  if (error) error.textContent = "界面示例，未连接账号服务";
}

document.addEventListener("click", function (event) {
  var dropdown = document.getElementById("userDropdown");
  if (!dropdown || dropdown.contains(event.target)) return;
  dropdown.classList.remove("open");
});

document.addEventListener("click", function (event) {
  var close = event.target.closest(".tab-close");
  if (!close) return;
  event.preventDefault();
  event.stopPropagation();
  var tab = close.closest(".multi-tab");
  if (tab) tab.remove();
});

applyBrand();
