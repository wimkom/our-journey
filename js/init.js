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

// ==========================
// RESTORE THEME IMMEDIATELY (before anything else loads)
// ==========================
if (storageAvailable()) {
  const savedTheme = localStorage.getItem("theme");
  
  // If user has saved a preference, apply it immediately
  if (savedTheme === "light") {
    document.body.classList.remove("dark");
  } else if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  // If no saved theme, keep the default from HTML (dark)
}

// ==========================
// LOAD NAVIGATION
// ==========================
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

    // Setup theme toggle button
    const toggle = document.getElementById("darkToggle");
    if (!toggle) return;

    // Set the toggle button icon based on current theme
    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";

    // FIXED: Check localStorage availability before using
    if (storageAvailable()) {
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
      // Set icon based on current theme
      const isDark = document.body.classList.contains("dark");
      toggle.textContent = isDark ? "☀️" : "🌙";
      
      toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const newIsDark = document.body.classList.contains("dark");
        toggle.textContent = newIsDark ? "☀️" : "🌙";
        
        // Try to save if possible
        if (storageAvailable()) {
          localStorage.setItem("theme", newIsDark ? "dark" : "light");
        }
      });
    }
  });