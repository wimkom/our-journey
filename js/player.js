const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const title = document.getElementById("title");
const volume = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

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

// FIXED: Safe localStorage getter
function getStorage(key, defaultValue) {
  if (storageAvailable()) {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
}

// FIXED: Safe localStorage setter
function setStorage(key, value) {
  if (storageAvailable()) {
    try {
      localStorage.setItem(key, value);
    } catch(e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

const songs = [
  { name: "TULUS - Cahaya", file: "./music/song1.mp3" },
  { name: "Idgitaf - Sedia Aku Sebelum Hujan", file: "./music/song2.mp3" },
  { name: "Lomba Sihir - Ribuan Memori", file: "./music/song3.mp3" },
  { name: "Sal Priadi - Kita usahakan rumah itu", file: "./music/song4.mp3" }
];

// ==========================
// LOAD STATE (with safe localStorage)
// ==========================
let index = parseInt(getStorage("songIndex", "0"));
let isPlaying = getStorage("isPlaying", "false") === "true";
let savedTime = parseFloat(getStorage("currentTime", "0"));
let savedVolume = parseFloat(getStorage("volume", "0.6"));
let lastSong = getStorage("lastSong", "");

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

  setStorage("songIndex", i);
  setStorage("lastSong", songs[i].file);
}

function resetTime() {
  audio.currentTime = 0;
  progress.style.width = "0%";
  setStorage("currentTime", 0);
}

function playSong() {
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    setStorage("isPlaying", "true");
  }).catch((err) => {
    // autoplay blocked (browser policy)
    console.warn('Autoplay blocked:', err);
  });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  setStorage("isPlaying", "false");
}

// ==========================
// LOAD SONG
// ==========================
loadSong(index);

// 🔒 PENTING: PLAY & RESTORE DI SINI
audio.addEventListener("loadedmetadata", () => {
  // restore time hanya kalau lagu sama
  if (lastSong === audio.src) {
    audio.currentTime = savedTime;
  }

  // autoplay lintas page
  if (
    getStorage("autoplayAllowed", "false") === "true" &&
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
  setStorage("volume", volume.value);
});

// ==========================
// SAVE PROGRESS
// ==========================
setInterval(() => {
  setStorage("currentTime", audio.currentTime);
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
    if (getStorage("autoplayAllowed", "false") !== "true") {
      setStorage("autoplayAllowed", "true");
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

// FIXED: Removed duplicate resetTime() function that was here
