const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const title = document.getElementById("title");
const volume = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");


const songs = [
  { name: "TULUS - Cahaya", file: "./music/song1.mp3" },
  { name: "Idgitaf - Sedia Aku Sebelum Hujan", file: "./music/song2.mp3" },
  { name: "Lomba Sihir - Ribuan Memori", file: "./music/song3.mp3" },
  { name: "Sal Priadi - Kita usahakan rumah itu", file: "./music/song4.mp3" }
];

// ==========================
// LOAD STATE
// ==========================
let index = parseInt(localStorage.getItem("songIndex")) || 0;
let isPlaying = localStorage.getItem("isPlaying") === "true";
let savedTime = parseFloat(localStorage.getItem("currentTime")) || 0;
let savedVolume = parseFloat(localStorage.getItem("volume")) || 0.6;
let lastSong = localStorage.getItem("lastSong");

// ==========================
// INIT
// ==========================
volume.value = savedVolume;
audio.volume = savedVolume;

// ==========================
// FUNCTIONS
// ==========================
function loadSong(i) {
  audio.src = songs[i].file;

  const titleEl = document.getElementById("title");
  const titleText = document.getElementById("title-text");

  titleText.textContent = songs[i].name;

  // cek apakah perlu marquee
  requestAnimationFrame(() => {
    if (titleText.scrollWidth > titleEl.clientWidth) {
      titleEl.classList.add("scroll");
    } else {
      titleEl.classList.remove("scroll");
    }
  });

  localStorage.setItem("songIndex", i);
  localStorage.setItem("lastSong", songs[i].file);
}

function resetTime() {
  audio.currentTime = 0;
  localStorage.setItem("currentTime", 0);
}

function playSong() {
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    localStorage.setItem("isPlaying", "true");
  }).catch(() => {
    // autoplay blocked (browser policy)
  });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  localStorage.setItem("isPlaying", "false");
}

// ==========================
// LOAD SONG
// ==========================
loadSong(index);

// 🔑 PENTING: PLAY & RESTORE DI SINI
audio.addEventListener("loadedmetadata", () => {
  // restore time hanya kalau lagu sama
  if (lastSong === audio.src) {
    audio.currentTime = savedTime;
  }

  // autoplay lintas page
  if (
    localStorage.getItem("autoplayAllowed") === "true" &&
    isPlaying
  ) {
    playSong();
  }
});

// ==========================
// CONTROLS
// ==========================
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
  index = (index + 1) % songs.length;
  resetTime();
  loadSong(index);
  playSong();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + songs.length) % songs.length;
  resetTime();
  loadSong(index);
  playSong();
});

// ==========================
// VOLUME
// ==========================
volume.addEventListener("input", () => {
  audio.volume = volume.value;
  localStorage.setItem("volume", volume.value);
});

// ==========================
// SAVE PROGRESS
// ==========================
setInterval(() => {
  localStorage.setItem("currentTime", audio.currentTime);
}, 1000);

// ==========================
// AUTO NEXT
// ==========================
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// ==========================
// AUTOPLAY UNLOCK (1x SEUMUR SITE)
// ==========================
document.addEventListener(
  "click",
  () => {
    if (localStorage.getItem("autoplayAllowed") !== "true") {
      localStorage.setItem("autoplayAllowed", "true");
      playSong();
    }
  },
  { once: true }
);

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

function resetTime() {
  audio.currentTime = 0;
  progress.style.width = "0%";
  localStorage.setItem("currentTime", 0);
}
