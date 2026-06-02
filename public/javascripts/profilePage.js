"use strict";


const themeToggleBtn = document.getElementById("themeToggle");
const toggleIcon = document.getElementById("toggle-icon");

function applyTheme(theme) {
  // Normalise: accept "dark"/"light" string OR boolean
  const isDark = theme === "dark" || theme === true;
  const resolved = isDark ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", resolved);

  if (toggleIcon) {
    toggleIcon.textContent = isDark ? "dark_mode" : "wb_sunny";
  }
  try {
    localStorage.setItem("prest-theme", resolved);
  } catch (_) {}
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}


(function initTheme() {
  let saved;
  try {
    saved = localStorage.getItem("prest-theme");
  } catch (_) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
})();

// Sync icon immediately after DOM attribute is set
(function syncIcon() {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  if (toggleIcon) {
    toggleIcon.textContent = theme === "dark" ? "dark_mode" : "wb_sunny";
  }
})();

// ★ KEY ADDITION — Listen for theme changes made on PAGE 1 (or any other tab)
// The `storage` event fires on all OTHER open tabs when localStorage changes.


window.addEventListener("storage", (e) => {
  if (e.key === "prest-theme" && e.newValue) {
    applyTheme(e.newValue); // e.newValue is "dark" or "light"
  }
});


(function initScrollReveal() {
  const items = document.querySelectorAll(".masonry-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 },
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
    observer.observe(el);
  });
})();

///nav bar ke  icon ke leya//

document.querySelectorAll(".nav-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".nav-icon")
      .forEach((i) => i.classList.remove("active"));
    icon.classList.add("active");
  });
});

document.querySelectorAll(".mobile-nav-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".mobile-nav-icon")
      .forEach((i) => i.classList.remove("active"));
    icon.classList.add("active");
  });
});



document.querySelectorAll(".tab-link").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".tab-link")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});



const toast = document.getElementById("toast");
let toastTimeout;

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg || "Done!";
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2400);
}



document.querySelectorAll(".btn-copy-prompt").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = btn.closest(".card");
    const title = card
      ? card.querySelector(".card-title")?.textContent
      : "Prompt";
    const text = `Generate an image: ${title || "AI Art"} – ultra-detailed, 8k, cinematic lighting`;
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast("Prompt copied to clipboard!");
  });
});

/// header section ke leya//

const header = document.getElementById("header");
window.addEventListener(
  "scroll",
  () => {
    if (!header) return;
    header.style.boxShadow =
      window.scrollY > 20 ? "0 2px 24px rgba(0,0,0,.10)" : "none";
  },
  { passive: true },
);

// save bitton ka leya//

document.querySelectorAll(".btn-save").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (btn.dataset.saved) return;
    btn.dataset.saved = "true";
    const orig = btn.textContent;
    btn.textContent = "Saved ✓";
    btn.style.background = "#16a34a";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = "";
      delete btn.dataset.saved;
    }, 1800);
  });
});

// follower button ka leya//

const followBtn = document.getElementById("followBtn");
if (followBtn) {
  let following = false;
  followBtn.addEventListener("click", () => {
    following = !following;
    if (following) {
      followBtn.textContent = "Following";
      followBtn.style.background = "#16a34a";
      showToast("You are now following @prompt_architect!");
    } else {
      followBtn.textContent = "Follow";
      followBtn.style.background = "";
    }
  });
}



const fab = document.getElementById("fab");
if (fab) {
  fab.addEventListener("click", () => {
    showToast("Create new prompt — coming soon!");
  });
}

//Nav bar ke leya//

const tabsNav = document.getElementById("tabs-nav");
window.addEventListener(
  "scroll",
  () => {
    if (tabsNav) {
      tabsNav.style.boxShadow =
        window.scrollY > 300 ? "0 2px 16px rgba(0,0,0,.08)" : "none";
    }
  },
  { passive: true },
);



const scrollTop = document.getElementById("scroll-top");
if (scrollTop) {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        scrollTop.classList.add("visible");
      } else {
        scrollTop.classList.remove("visible");
      }
    },
    { passive: true },
  );
  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
