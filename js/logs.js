var logRows = [
  { user: "管理员", time: "2026-10-20 09:18:06", action: "登录", kind: "tag-primary", detail: "登录成功", ip: "10.0.0.8" },
  { user: "操作员", time: "2026-10-20 09:02:41", action: "新增", kind: "tag-info", detail: "新增一条记录", ip: "10.0.0.12" },
  { user: "管理员", time: "2026-10-19 16:40:22", action: "重置密码", kind: "tag-warning", detail: "重置账号 operator", ip: "10.0.0.8" },
  { user: "查阅员", time: "2026-10-19 11:05:18", action: "登录失败", kind: "tag-error", detail: "密码错误", ip: "10.0.0.21" },
  { user: "管理员", time: "2026-10-18 15:22:03", action: "修改设置", kind: "tag-primary", detail: "更新登录方式", ip: "10.0.0.8" },
  { user: "操作员", time: "2026-10-18 10:11:47", action: "编辑", kind: "tag-primary", detail: "编辑一条记录", ip: "10.0.0.12" },
  { user: "管理员", time: "2026-10-17 14:08:55", action: "停用", kind: "tag-error", detail: "停用账号 viewer", ip: "10.0.0.8" },
  { user: "管理员", time: "2026-10-16 09:30:10", action: "新增角色", kind: "tag-info", detail: "新增角色 查阅员", ip: "10.0.0.8" }
];
var logPage = 1;
var logPageSize = 5;
var logFiltered = logRows.slice();

function pad(value) { return String(value).padStart(2, "0"); }
function ymd(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }

function applyLogRange() {
  var today = new Date(2026, 9, 20);
  var from = new Date(2026, 8, 20);
  document.getElementById("filter-date-from").value = ymd(from);
  document.getElementById("filter-date-to").value = ymd(today);
}

function filterLogs() {
  var from = document.getElementById("filter-date-from").value;
  var to = document.getElementById("filter-date-to").value;
  var user = document.getElementById("filter-user").value;
  var action = document.getElementById("filter-action").value;
  logFiltered = logRows.filter(function (row) {
    var day = row.time.slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (user && row.user !== user) return false;
    if (action && row.action !== action) return false;
    return true;
  });
  logPage = 1;
  renderLogs();
}

function renderLogs() {
  var tbody = document.getElementById("log-list");
  var empty = document.getElementById("empty-msg");
  var table = document.getElementById("log-table");
  var start = (logPage - 1) * logPageSize;
  var rows = logFiltered.slice(start, start + logPageSize);
  var pages = Math.max(1, Math.ceil(logFiltered.length / logPageSize));
  tbody.innerHTML = "";
  if (!logFiltered.length) {
    empty.style.display = "flex";
    table.style.display = "none";
  } else {
    empty.style.display = "none";
    table.style.display = "";
    rows.forEach(function (row, index) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + (start + index + 1) + "</td><td>" + row.user + "</td><td>" + row.time + '</td><td><span class="tag ' + row.kind + '">' + row.action + '</span></td><td class="log-detail">' + row.detail + "</td><td>" + row.ip + "</td>";
      tbody.appendChild(tr);
    });
  }
  document.getElementById("pager-info").textContent = "共 " + logFiltered.length + " 条";
  document.getElementById("pager-prev").disabled = logPage <= 1;
  document.getElementById("pager-next").disabled = logPage >= pages;
}

function resetLogFilter() {
  document.getElementById("filter-user").value = "";
  document.getElementById("filter-action").value = "";
  applyLogRange();
  filterLogs();
}

applyLogRange();
filterLogs();
document.getElementById("pager-prev").addEventListener("click", function () { if (logPage > 1) { logPage -= 1; renderLogs(); } });
document.getElementById("pager-next").addEventListener("click", function () {
  var pages = Math.ceil(logFiltered.length / logPageSize);
  if (logPage < pages) { logPage += 1; renderLogs(); }
});
