/* =========================================================================
   EDIT EVERYTHING BELOW THIS LINE — this is the only file you need to
   touch to update picks, the leaderboard, or podcast episodes.
   ========================================================================= */

// ---- TODAY'S PICKS (the 3 cards) ----
const PICKS = [
  {
    initial: "D",
    record: "18–9",
    units: "+7.4U",
    name: "Dustin",
    sport: "MLB · Player Prop",
    betName: "Ohtani 1+ Total Base",
    betLabel: "PowerPlay Pick",
    odds: "+107",
    badge: "Best Bet"
  },
  {
    initial: "G",
    record: "21–12",
    units: "+6.8U",
    name: "Gavin",
    sport: "NFL · Anytime TD",
    betName: "Featured RB Anytime TD",
    betLabel: "PowerPlay Pick",
    odds: "+125",
    badge: "Locked In"
  },
  {
    initial: "I",
    record: "16–10",
    units: "+5.9U",
    name: "Izzy",
    sport: "NBA · Moneyline",
    betName: "Home Team ML",
    betLabel: "PowerPlay Pick",
    odds: "-115",
    badge: "Value"
  }
];

// ---- SEASON STATS ROW ----
const STATS = [
  { value: "55–31", label: "Combined record" },
  { value: "+20.1U", label: "Units this season" },
  { value: "63.9%", label: "Win rate" },
  { value: "3", label: "Active cappers" }
];

// ---- LEADERBOARD ----
const LEADERBOARD = [
  { rank: "01", name: "Dustin", sports: "MLB / NFL", record: "18–9", winRate: "66.7%", units: "+7.4U" },
  { rank: "02", name: "Gavin",  sports: "NFL / NBA", record: "21–12", winRate: "63.6%", units: "+6.8U" },
  { rank: "03", name: "Izzy",   sports: "NBA / MLB", record: "16–10", winRate: "61.5%", units: "+5.9U" },
  { rank: "04", name: "Austin", sports: "MLB / NFL", record: "—", winRate: "—", units: "—" },
  { rank: "05", name: "DJ",     sports: "NBA / NFL", record: "—", winRate: "—", units: "—" },
  { rank: "06", name: "Mejia",  sports: "MLB / NBA", record: "—", winRate: "—", units: "—" }
];

// ---- HOSTS & THEIR YOUTUBE SHORTS ----
// Each host has their own list of shorts. To add a new short, copy one of
// the { title, youtubeId } lines inside that host's "shorts" array — order
// doesn't matter, the list can grow as long as you want.
//
// youtubeId = the part of the short's URL after "shorts/"
// e.g. for https://www.youtube.com/shorts/dQw4w9WgXcQ the id is "dQw4w9WgXcQ"
const HOSTS = [
  {
    name: "Dustin",
    shorts: [
      { title: "Ohtani prop breakdown", youtubeId: "wYK-ISxxZ9k" },
      { title: "Why I'm on the Under tonight", youtubeId: "REPLACE_WITH_SHORT_ID" }
    ]
  },
  {
    name: "Gavin",
    shorts: [
      { title: "Anytime TD value play", youtubeId: "REPLACE_WITH_SHORT_ID" }
    ]
  },
  {
    name: "Izzy",
    shorts: [
      { title: "Home ML lock breakdown", youtubeId: "REPLACE_WITH_SHORT_ID" }
    ]
  },
  {
    name: "Austin",
    shorts: []
  },
  {
    name: "DJ",
    shorts: []
  },
  {
    name: "Mejia",
    shorts: []
  }
];

/* =========================================================================
   Nothing below this line needs to be edited to update content.
   ========================================================================= */

function renderPicks() {
  const grid = document.getElementById("picks-grid");
  grid.innerHTML = PICKS.map(p => `
    <article class="pick-card">
      <div class="pick-card-top">
        <div class="avatar">${p.initial}</div>
        <div class="pick-card-record">${p.record} &middot; <span class="u-positive">${p.units}</span></div>
      </div>
      <h3 class="pick-name">${p.name}</h3>
      <p class="pick-sport">${p.sport}</p>
      <hr class="pick-divider">
      <div class="pick-bet-row">
        <div>
          <p class="pick-bet-name">${p.betName}</p>
          <p class="pick-bet-label">${p.betLabel}</p>
        </div>
        <div class="pick-odds">${p.odds}</div>
      </div>
      <span class="pick-badge">${p.badge}</span>
    </article>
  `).join("");
}

function renderStats() {
  const row = document.getElementById("stats-row");
  row.innerHTML = STATS.map(s => `
    <div class="stat-cell">
      <p class="stat-value">${s.value}</p>
      <p class="stat-label">${s.label}</p>
    </div>
  `).join("");
}

function renderLeaderboard() {
  const body = document.getElementById("leaderboard-body");
  body.innerHTML = LEADERBOARD.map(r => `
    <tr>
      <td class="col-num">${r.rank}</td>
      <td>
        <p class="capper-name">${r.name}</p>
        <p class="capper-sports">${r.sports}</p>
      </td>
      <td>${r.record}</td>
      <td>${r.winRate}</td>
      <td class="${r.units === '—' ? 'units-empty' : 'units-positive'}">${r.units}</td>
    </tr>
  `).join("");
}

function renderHosts() {
  const wrap = document.getElementById("host-pills");
  wrap.innerHTML = HOSTS.map(h => `<span class="host-pill">${h.name}</span>`).join("");
}

function youtubeShortThumbUrl(id) {
  // YouTube auto-generates a thumbnail for every video/short at this URL —
  // no need to upload thumbnails yourself.
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function youtubeShortEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&loop=1&playlist=${id}`;
}

let activeHostIndex = 0;

function renderHostTabs() {
  const tabs = document.getElementById("host-tabs");
  tabs.innerHTML = HOSTS.map((h, i) => `
    <button class="host-tab ${i === activeHostIndex ? 'is-active' : ''}"
            type="button" role="tab" data-index="${i}">${h.name}</button>
  `).join("");

  tabs.querySelectorAll(".host-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeHostIndex = Number(btn.dataset.index);
      renderHostTabs();
      renderShortsGrid();
    });
  });
}

function renderShortsGrid() {
  const grid = document.getElementById("shorts-grid");
  const host = HOSTS[activeHostIndex];

  if (!host.shorts.length) {
    grid.innerHTML = `<p class="shorts-empty">No shorts posted for ${host.name} yet.</p>`;
    return;
  }

  grid.innerHTML = host.shorts.map((s, i) => `
    <button class="short-card" type="button" data-index="${i}">
      <span class="short-thumb-wrap">
        <img src="${youtubeShortThumbUrl(s.youtubeId)}" alt="" loading="lazy">
        <span class="short-play-badge"><span>&#9654;</span></span>
      </span>
      <p class="short-card-title">${s.title}</p>
    </button>
  `).join("");

  grid.querySelectorAll(".short-card").forEach(card => {
    card.addEventListener("click", () => {
      const short = host.shorts[Number(card.dataset.index)];
      openShortModal(short);
    });
  });
}

function openShortModal(short) {
  const modal = document.getElementById("short-modal");
  const frame = document.getElementById("short-modal-frame");
  frame.innerHTML = `<iframe
      src="${youtubeShortEmbedUrl(short.youtubeId)}"
      title="${short.title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeShortModal() {
  const modal = document.getElementById("short-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("short-modal-frame").innerHTML = ""; // stop playback
}

function setupShortModal() {
  document.getElementById("short-modal-close").addEventListener("click", closeShortModal);
  document.getElementById("short-modal-backdrop").addEventListener("click", closeShortModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeShortModal();
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

renderPicks();
renderStats();
renderLeaderboard();
renderHosts();
renderHostTabs();
renderShortsGrid();
setupShortModal();
setupMobileMenu();
