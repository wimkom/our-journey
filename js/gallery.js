document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modal-close");
  const galleryImages = document.querySelectorAll(".gallery img");

  if (!modal || !modalImg || !modalClose || galleryImages.length === 0) return;

  function openModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
    modalClose.focus();
  }

  function closeModal() {
    modal.style.display = "none";
    modalImg.src = "";
  }

  galleryImages.forEach(img => {
    img.addEventListener("click", () => openModal(img.src));

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(img.src);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });
});
