// PowerPlay age/terms gate. Runs before script.js so the page is locked
// down before any content-loading happens.
//
// TERMS_VERSION: bump this (e.g. to "2") any time the disclaimer text in
// index.html or terms.html materially changes — it re-shows the gate to
// everyone, even people who already accepted an older version.
const TERMS_VERSION = "1";
const STORAGE_KEY = `powerplay_terms_accepted_v${TERMS_VERSION}`;

function hasAcceptedTerms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.accepted === true;
  } catch {
    return false;
  }
}

function recordAcceptance() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accepted: true,
      at: new Date().toISOString()
    }));
  } catch {
    // If storage is unavailable (private browsing, etc.) the gate will
    // just show again next visit — acceptable fallback, never a crash.
  }
}

function lockPageScroll() {
  document.documentElement.style.overflow = "hidden";
}

function unlockPageScroll() {
  document.documentElement.style.overflow = "";
}

function trapFocusInGate(e) {
  const gate = document.getElementById("terms-gate");
  if (gate.classList.contains("is-hidden") || e.key !== "Tab") return;
  const focusable = gate.querySelectorAll('button, [href], input:not([disabled])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function initTermsGate() {
  const gate = document.getElementById("terms-gate");
  const checkbox = document.getElementById("terms-gate-checkbox");
  const enterBtn = document.getElementById("terms-gate-enter");
  const exitBtn = document.getElementById("terms-gate-exit");

  if (hasAcceptedTerms()) {
    gate.classList.add("is-hidden");
    return;
  }

  lockPageScroll();
  checkbox.focus();

  checkbox.addEventListener("change", () => {
    enterBtn.disabled = !checkbox.checked;
  });

  enterBtn.addEventListener("click", () => {
    if (!checkbox.checked) return;
    recordAcceptance();
    gate.classList.add("is-hidden");
    unlockPageScroll();
  });

  exitBtn.addEventListener("click", () => {
    window.location.href = "https://www.ncpgambling.org";
  });

  document.addEventListener("keydown", trapFocusInGate);
}

initTermsGate();
