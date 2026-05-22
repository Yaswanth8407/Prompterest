

"use strict";


function applyTheme(dark) {
  const html = document.documentElement;
  const icon = document.getElementById("toggle-icon");
  if (dark) {
    html.classList.add("dark");
    if (icon) icon.textContent = "dark_mode";
  } else {
    html.classList.remove("dark");
    if (icon) icon.textContent = "light_mode";
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  const icon = document.getElementById("toggle-icon");
  if (icon) icon.textContent = isDark ? "dark_mode" : "light_mode";
  try {
    localStorage.setItem("prest-theme", isDark ? "dark" : "light");
  } catch (_) {}
}

(function initTheme() {
  let saved;
  try {
    saved = localStorage.getItem("prest-theme");
  } catch (_) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = saved ? saved === "dark" : prefersDark;
  applyTheme(useDark);
})();


function initSidebarNav() {
  const icons = document.querySelectorAll("#sidebar .nav-icon");
  icons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      icons.forEach((i) => i.classList.remove("active"));
      icon.classList.add("active");
    });
  });
}


function initChips() {
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}


function initScrollReveal() {
  const items = document.querySelectorAll(".masonry-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.06,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Stagger entry delays for initial viewport items
  items.forEach((item, i) => {
    item.style.transitionDelay = `${Math.min(i * 40, 400)}ms`;
    observer.observe(item);
  });
}


function initScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 420) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function showToast(msg = "Prompt copied!") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "90px",
      left: "50%",
      transform: "translateX(-50%) translateY(16px)",
      background: "#1c1b1b",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "99px",
      fontFamily: "'Hanken Grotesk', sans-serif",
      fontSize: "13px",
      fontWeight: "600",
      zIndex: "999",
      opacity: "0",
      transition: "opacity 0.25s ease, transform 0.25s ease",
      pointerEvents: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
  }, 2200);
}

function initCopyButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (btn) {
      const promptText =
        btn.closest(".masonry-item")?.querySelector(".card-title")
          ?.textContent || "Prompt";
      // In a real app, copy actual prompt text
      try {
        navigator.clipboard.writeText(`[Prompt] ${promptText}`);
      } catch (_) {}
      showToast("Prompt copied! ✓");
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}


function initSidebarExpand() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  const header = document.getElementById("header");
  if (!sidebar || window.innerWidth <= 640) return;

  sidebar.addEventListener("mouseenter", () => {
    if (window.innerWidth > 640) {
      main.style.marginLeft = "180px";
      header.style.marginLeft = "180px";
    }
  });

  sidebar.addEventListener("mouseleave", () => {
    main.style.marginLeft = "";
    header.style.marginLeft = "";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initSidebarNav();
  initChips();
  initScrollReveal();
  initScrollTop();
  initCopyButtons();
  initSmoothScroll();
  initSidebarExpand();
});


