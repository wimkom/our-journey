// ==========================
// ELEMENTS
// ==========================
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const title = document.getElementById("title");
const titleText = document.getElementById("title-text");
const volume = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

// ==========================
// SAFE STORAGE
// ==========================
function storageAvailable() {
  try {
    const t = "__test__";
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function getStorage(key, fallback) {
  return storageAvailable() ? localStorage.getItem(key) ?? fallback : fallback;
}

function setStorage(key, value) {
  if (storageAvailable()) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
}

// ==========================
// PLAYLIST
// ==========================
const songs = [
  { name: "TULUS - Cahaya", file: "./music/song1.mp3" },
  { name: "Idgitaf - Sedia Aku Sebelum Hujan", file: "./music/song2.mp3" },
  { name: "Lomba Sihir - Ribuan Memori", file: "./music/song3.mp3" },
  { name: "Sal Priadi - Kita Usahakan Rumah Itu", file: "./music/song4.mp3" }
];

// ==========================
// STATE
// ==========================
let index = parseInt(getStorage("songIndex", "0"), 10);
let isPlaying = getStorage("isPlaying", "false") === "true";
let savedTime = parseFloat(getStorage("currentTime", "0"));
let savedVolume = parseFloat(getStorage("volume", "0.6"));
let lastSong = getStorage("lastSong", "");

// ==========================
// INIT
// ==========================
audio.volume = savedVolume;
volume.value = savedVolume;

// ==========================
// MARQUEE (INI KUNCI)
// ==========================
function updateTitleScroll() {
  // reset total
  title.classList.remove("scroll");
  titleText.style.animation = "none";

  // force browser reflow
  void titleText.offsetWidth;

  // delay kecil biar layout settle
  setTimeout(() => {
    if (titleText.scrollWidth > title.clientWidth) {
      title.classList.add("scroll");
      titleText.style.animation = "";
    }
  }, 60);
}

// ==========================
// LOAD SONG
// ==========================
function loadSong(i) {
  audio.src = songs[i].file;
  titleText.textContent = songs[i].name;

  updateTitleScroll();

  setStorage("songIndex", i);
  setStorage("lastSong", songs[i].file);
}

// ==========================
// PLAYER CONTROLS
// ==========================
function playSong() {
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    setStorage("isPlaying", "true");
  }).catch(() => {});
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  setStorage("isPlaying", "false");
}

function resetTime() {
  audio.currentTime = 0;
  progress.style.width = "0%";
  setStorage("currentTime", 0);
}

// ==========================
// LOAD FIRST
// ==========================
loadSong(index);

audio.addEventListener("loadedmetadata", () => {
  if (lastSong === audio.src) {
    audio.currentTime = savedTime;
  }

  if (getStorage("autoplayAllowed", "false") === "true" && isPlaying) {
    playSong();
  }
});

// ==========================
// BUTTON EVENTS
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
  setStorage("volume", volume.value);
});

// ==========================
// PROGRESS
// ==========================
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// ==========================
// AUTO NEXT
// ==========================
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// ==========================
// SAVE TIME
// ==========================
setInterval(() => {
  setStorage("currentTime", audio.currentTime);
}, 1000);

// ==========================
// AUTOPLAY UNLOCK (1x)
// ==========================
document.addEventListener("click", () => {
  if (getStorage("autoplayAllowed", "false") !== "true") {
    setStorage("autoplayAllowed", "true");
    playSong();
  }
}, { once: true });
