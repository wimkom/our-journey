// ==========================
// INITIALIZE NAVIGATION & THEME
// ==========================

// Load and render navigation
fetch("nav.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    // Highlight current page in nav
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach(link => {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });

    // Setup theme toggle
    const toggle = document.getElementById("darkToggle");
    if (!toggle) return;

    // Restore theme from localStorage
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    }

    // Theme toggle click handler
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        toggle.textContent = "🌙";
      }
    });
  });