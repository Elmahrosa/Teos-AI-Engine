const TIER_LABELS = { 1: "Ready", 2: "Stable", 3: "Needs Work", 4: "Critical" };

let RECORD = null;
let chart = null;
const WEEKS = 12;

const $ = (id) => document.getElementById(id);

function repoNameFromUrl() {
  const seg = window.location.pathname.split("/").filter(Boolean);
  if (seg.length >= 1 && seg[0] !== "Elmahrosa.github.io") return seg[0];
  return window.location.hostname.replace(/\.github\.io$/, "");
}

function fmtAgo(epochSec) {
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - epochSec);
  if (diff < 60) return "just now";
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

async function fetchData() {
  try {
    const res = await fetch("data/latest.jsonl");
    if (!res.ok) {
      if (res.status === 404) {
        $("empty").style.display = "block";
        $("updated-text").textContent = "no data yet";
        return;
      }
      throw new Error(`data/latest.jsonl returned ${res.status}`);
    }
    const lines = (await res.text())
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try { return JSON.parse(l); } catch { return null; }
      })
      .filter(Boolean);
    if (!lines.length) throw new Error("data/latest.jsonl is empty");
    RECORD = lines[lines.length - 1];
    render();
  } catch (err) {
    const el = $("error");
    el.style.display = "block";
    el.textContent = "⚠ " + (err.message || "Failed to load audit data");
  }
}

function scoreColor(s) {
  if (s >= 85) return "var(--ok)";
  if (s >= 70) return "var(--accent)";
  if (s >= 50) return "#d29922";
  return "var(--danger)";
}

function render() {
  document.title = `${RECORD.repo} — Repo Audit`;
  $("repo-name").textContent = RECORD.full_name;

  $("hero").style.display = "grid";
  $("checks-panel").style.display = "block";
  $("chart-panel").style.display = "block";

  const scoreEl = $("score");
  scoreEl.textContent = RECORD.health_score;
  scoreEl.style.color = scoreColor(RECORD.health_score);
  $("tier-pill").innerHTML = `<span class="pill t${RECORD.tier}">Tier ${RECORD.tier} — ${TIER_LABELS[RECORD.tier]}</span>`;

  const pushed = RECORD.pushed_at
    ? fmtAgo(Math.floor(new Date(RECORD.pushed_at).getTime() / 1000))
    : "—";
  $("stats").innerHTML = [
    ["Commits 90d", RECORD.commits_90d],
    ["Open issues", RECORD.open_issues],
    ["Stars", RECORD.stars],
    ["Language", RECORD.language || "—"],
    ["Last push", pushed],
  ]
    .map(([l, v]) => `<div class="stat"><div class="num">${v}</div><div class="lbl">${l}</div></div>`)
    .join("");

  const order = [
    "has_description", "has_readme", "has_license", "has_ci", "not_archived",
    "recent_push", "clean_issues", "active_commits", "rich_metadata", "has_stars",
  ];
  const names = {
    has_description: "description", has_readme: "README", has_license: "license",
    has_ci: "CI workflow", not_archived: "not archived", recent_push: "push < 90d",
    clean_issues: "issues ≤ 5", active_commits: "≥10 commits/90d",
    rich_metadata: "topics ≥ 3", has_stars: "has stars",
  };
  $("checks").innerHTML = order
    .map((k) => {
      const ok = !!RECORD.checks?.[k];
      return `<div class="check ${ok ? "pass" : "fail"}"><span class="mark">${ok ? "✓" : "✕"}</span><span class="label">${names[k]}</span></div>`;
    })
    .join("");

  renderChart();

  const updated = RECORD.generated_epoch
    ? new Date(RECORD.generated_epoch * 1000).toLocaleString()
    : new Date(RECORD.pushed_at).toLocaleString();
  $("updated-text").textContent = `Audited ${updated}`;
}

function renderChart() {
  const ctx = $("chart");
  if (chart) chart.destroy();
  const tick = getComputedStyle(document.documentElement).getPropertyValue("--chart-tick").trim();
  const grid = getComputedStyle(document.documentElement).getPropertyValue("--chart-grid").trim();
  const text = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
  const labels = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    const d = new Date(Date.now() - w * 7 * 86400000);
    labels.push(d.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
  }
  const series = RECORD.trajectory || new Array(WEEKS).fill(0);
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "commits / week",
        data: series,
        borderColor: "var(--accent)",
        backgroundColor: "var(--accent)",
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { color: grid }, ticks: { color: tick, font: { size: 11 } } },
        y: { beginAtZero: true, grid: { color: grid }, ticks: { color: tick } },
      },
      plugins: { legend: { labels: { color: text } } },
    },
  });
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const theme = saved || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  syncThemeBtn();
}
function syncThemeBtn() {
  const cur = document.documentElement.getAttribute("data-theme");
  $("theme-btn").textContent = cur === "dark" ? "☾ Dark" : "☀ Light";
}

$("theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  syncThemeBtn();
  if (chart) renderChart();
});
$("refresh-btn").addEventListener("click", fetchData);

initTheme();
fetchData();
