// EDIT THIS: point at your deployed Worker's URL (from `wrangler deploy`).
   const WORKER_URL = "https://powerplay-admin.powerplaypicksadmin.workers.dev";

// The session token is kept ONLY in this variable — never in localStorage,
// sessionStorage, or a cookie. That means refreshing the page logs you out
// (you'll need to log in again), which is intentional: there's nothing
// sitting on disk in the browser for anyone to steal.
let sessionToken = null;
let currentData = { picks: [], stats: [], leaderboard: [] };

const loginView = document.getElementById("login-view");
const editView = document.getElementById("edit-view");
const loginError = document.getElementById("login-error");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in…";

  try {
    const res = await fetch(`${WORKER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const body = await res.json();

    if (!res.ok) {
      loginError.textContent = body.error || "Login failed.";
      return;
    }

    sessionToken = body.token;
    await loadData();
    loginView.classList.add("hidden");
    editView.classList.remove("hidden");
  } catch {
    loginError.textContent = "Could not reach the server. Try again.";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Log in";
  }
}

async function logout() {
  if (sessionToken) {
    try {
      await fetch(`${WORKER_URL}/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
    } catch {
      // best-effort; clear locally regardless
    }
  }
  sessionToken = null;
  editView.classList.add("hidden");
  loginView.classList.remove("hidden");
  document.getElementById("password").value = "";
}

async function loadData() {
  const res = await fetch(`${WORKER_URL}/data`, {
    headers: { "Authorization": `Bearer ${sessionToken}` }
  });
  if (!res.ok) {
    if (res.status === 401) return logout();
    throw new Error("Failed to load data.");
  }
  const body = await res.json();
  currentData = body.data;
  renderFields();
}

function fieldRow(obj, keys, path, index) {
  return `<div class="field-row" data-path="${path}" data-index="${index}">
    ${keys.map(k => `
      <div>
        <span class="field-row-label">${k}</span>
        <input data-key="${k}" value="${(obj[k] ?? "").toString().replace(/"/g, "&quot;")}">
      </div>
    `).join("")}
  </div>`;
}

function renderFields() {
  const picksKeys = ["initial", "record", "units", "name", "sport", "betName", "betLabel", "odds", "badge"];
  document.getElementById("picks-fields").innerHTML =
    currentData.picks.map((p, i) => fieldRow(p, picksKeys, "picks", i)).join("");

  const statsKeys = ["value", "label"];
  document.getElementById("stats-fields").innerHTML =
    currentData.stats.map((s, i) => fieldRow(s, statsKeys, "stats", i)).join("");

  const lbKeys = ["rank", "name", "sports", "record", "winRate", "units"];
  document.getElementById("leaderboard-fields").innerHTML =
    currentData.leaderboard.map((r, i) => fieldRow(r, lbKeys, "leaderboard", i)).join("");
}

function collectFieldsInto(data) {
  document.querySelectorAll(".field-row").forEach(row => {
    const path = row.dataset.path;
    const index = Number(row.dataset.index);
    row.querySelectorAll("input").forEach(input => {
      data[path][index][input.dataset.key] = input.value;
    });
  });
}

async function save() {
  collectFieldsInto(currentData);
  saveBtn.disabled = true;
  saveStatus.textContent = "Saving…";
  saveStatus.className = "status-msg";

  try {
    const res = await fetch(`${WORKER_URL}/data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ data: currentData })
    });
    const body = await res.json();

    if (!res.ok) {
      saveStatus.textContent = body.error || "Save failed.";
      saveStatus.className = "status-msg err";
      if (res.status === 401) await logout();
      return;
    }

    saveStatus.textContent = "Saved! The live site updates in a minute or two.";
    saveStatus.className = "status-msg ok";
  } catch {
    saveStatus.textContent = "Could not reach the server.";
    saveStatus.className = "status-msg err";
  } finally {
    saveBtn.disabled = false;
  }
}

loginBtn.addEventListener("click", login);
document.getElementById("password").addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});
logoutBtn.addEventListener("click", logout);
saveBtn.addEventListener("click", save);
