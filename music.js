
// =====================================
// KAZZPARS RETRO MUSIC PLAYER
// =====================================

const audio = document.getElementById("audio-player");
const player = document.getElementById("music-player");
const playPauseButton = document.getElementById("play-pause");
const trackName = document.getElementById("track-name");
const playerTime = document.getElementById("player-time");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume-slider");
const playerStatus = document.getElementById("player-status");
const albumIcon = document.getElementById("album-icon");

// Ganti file lagu dengan milikmu.
// Simpan file audio di folder music/.

const playlist = [
    {
        title: "Track 01 - My Favorite Song",
        src: "music/best years in our lives.mp3"
    },
    {
        title: "Track 02 - Another Song",
        src: "music/Easing The Pain.mp3"
    }
];

let currentTrack = 0;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

function loadTrack(index) {
    currentTrack = (index + playlist.length) % playlist.length;

    audio.src = playlist[currentTrack].src;
    trackName.textContent = playlist[currentTrack].title;
    progressBar.style.width = "0%";
    playerTime.textContent = "00:00 / 00:00";
    playerStatus.textContent = "TRACK LOADED";
}

async function playMusic() {
    if (!audio.src) {
        loadTrack(currentTrack);
    }

    try {
        await audio.play();

        player.classList.add("is-playing");
        albumIcon.classList.add("spinning");

        playPauseButton.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        playPauseButton.setAttribute("aria-label", "Pause music");
        playerStatus.textContent = "NOW PLAYING";
    } catch (error) {
        playerStatus.textContent = "CANNOT PLAY TRACK";
        console.error("Playback failed:", error);
    }
}

function pauseMusic() {
    audio.pause();

    player.classList.remove("is-playing");
    albumIcon.classList.remove("spinning");

    playPauseButton.innerHTML =
        '<i class="fa-solid fa-play"></i>';

    playPauseButton.setAttribute("aria-label", "Play music");
    playerStatus.textContent = "PAUSED";
}

playPauseButton.addEventListener("click", () => {
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

document.getElementById("prev-track").addEventListener("click", () => {
    loadTrack(currentTrack - 1);
    playMusic();
});

document.getElementById("next-track").addEventListener("click", () => {
    loadTrack(currentTrack + 1);
    playMusic();
});

audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const progress = (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = `${progress}%`;

    playerTime.textContent =
        `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

audio.addEventListener("loadedmetadata", () => {
    playerTime.textContent =
        `00:00 / ${formatTime(audio.duration)}`;
});

audio.addEventListener("ended", () => {
    loadTrack(currentTrack + 1);
    playMusic();
});

audio.addEventListener("error", () => {
    playerStatus.textContent = "AUDIO FILE NOT FOUND";
});

volumeSlider.addEventListener("input", () => {
    audio.volume = Number(volumeSlider.value);
});

document.querySelector(".progress-container").addEventListener("click", (event) => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;

    audio.currentTime = Math.max(
        0,
        Math.min(1, position)
    ) * audio.duration;
});

// Setelan awal
audio.volume = Number(volumeSlider.value);
loadTrack(0);
