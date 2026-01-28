// ==========================
// INITIALIZE NAVIGATION & THEME
// ==========================

// FIXED: Helper function to check localStorage availability
function storageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

// FIXED: Added error handling for fetch
fetch("nav.html")
  .then(res => {
    if (!res.ok) {
      throw new Error('Navigation failed to load');
    }
    return res.text();
  })
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

    // FIXED: Check localStorage availability before using
    if (storageAvailable()) {
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
    } else {
      // Fallback: Just toggle dark mode without persistence
      toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
      });
    }
  })
  .catch(err => {
    // FIXED: Error handling with fallback navigation
    console.error('Navigation loading error:', err);
    
    // Provide basic fallback navigation
    const fallbackNav = `
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
      <nav>
        <a href="index.html">Home</a> |
        <a href="gallery.html">Gallery</a> |
        <a href="journal.html">Journal</a>
        <button id="darkToggle" aria-label="Toggle dark mode" aria-pressed="true">🌙</button>
      </nav>
    `;
    
    document.getElementById("navbar").innerHTML = fallbackNav;
    
    // Setup basic theme toggle even in fallback mode
    const toggle = document.getElementById("darkToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
      });
    }
  });
