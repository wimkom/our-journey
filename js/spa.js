document.addEventListener("click", e => {
  const link = e.target.closest("a[data-link]");
  if (!link) return;

  e.preventDefault();
  fetch(link.href)
    .then(r => r.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      document.getElementById("content").innerHTML =
        doc.getElementById("content").innerHTML;
      history.pushState({}, "", link.href);
    });
});
