// ==========================
// ELEMENTS
// ==========================
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const title = document.getElementById("title");
const volume = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

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
// STORAGE HELPERS
// ==========================
const get = (k, d) => localStorage.getItem(k) ?? d;
const set = (k, v) => localStorage.setItem(k, v);

// ==========================
// STATE (RESTORE ON LOAD)
// ==========================
let index = parseInt(get("player:index", "0"), 10);
let isPlaying = get("player:playing", "false") === "true";
let savedTime = parseFloat(get("player:time", "0"));
let expanded = get("player:titleExpanded", "false") === "true";
let savedVolume = parseFloat(get("player:volume", "0.6"));

// ==========================
// INIT
// ==========================
audio.volume = savedVolume;
volume.value = savedVolume;

// ==========================
// LOAD SONG (RESET TIME)
// ==========================
function loadSong(i) {
  audio.src = songs[i].file;
  audio.currentTime = 0;

  title.textContent = songs[i].name;
  title.classList.toggle("expanded", expanded);

  set("player:index", i);
  set("player:time", 0);
}

// ==========================
// INITIAL LOAD (PAGE LOAD ONLY)
// ==========================
loadSong(index);

audio.addEventListener("loadedmetadata", () => {
  // restore time ONLY on page reload
  if (savedTime > 0) {
    audio.currentTime = savedTime;
  }

  if (isPlaying) {
    audio.play().catch(() => {});
    playBtn.textContent = "⏸";
  } else {
    playBtn.textContent = "▶";
  }
});

// ==========================
// PLAY / PAUSE
// ==========================
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    playBtn.textContent = "⏸";
    set("player:playing", "true");
  } else {
    audio.pause();
    playBtn.textContent = "▶";
    set("player:playing", "false");
  }
});

// ==========================
// NEXT / PREV (START FROM 0)
// ==========================
nextBtn.addEventListener("click", () => {
  index = (index + 1) % songs.length;
  loadSong(index);
  audio.play().catch(() => {});
  playBtn.textContent = "⏸";
  set("player:playing", "true");
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  audio.play().catch(() => {});
  playBtn.textContent = "⏸";
  set("player:playing", "true");
});

// ==========================
// TITLE EXPAND (REMEMBER STATE)
// ==========================
title.addEventListener("click", () => {
  expanded = !expanded;
  title.classList.toggle("expanded", expanded);
  set("player:titleExpanded", expanded);
});

// ==========================
// VOLUME
// ==========================
volume.addEventListener("input", () => {
  audio.volume = volume.value;
  set("player:volume", volume.value);
});

// ==========================
// PROGRESS + SAVE TIME
// ==========================
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.style.width =
    (audio.currentTime / audio.duration) * 100 + "%";

  set("player:time", audio.currentTime);
});

// ==========================
// SEEK
// ==========================
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  audio.currentTime =
    (e.offsetX / width) * audio.duration;
});

// ==========================
// AUTO NEXT (START FROM 0)
// ==========================
audio.addEventListener("ended", () => {
  nextBtn.click();
});
