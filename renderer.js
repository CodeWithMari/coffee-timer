const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  // Minimize and close
  document.getElementById('min-btn').addEventListener('click', () => {
    ipcRenderer.send('minimize');
  });

  document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close');
  });

  // var timer
  let totalSeconds = 0;
  let currentSeconds = 0;
  let interval = null;
  let isRunning = false;

  const menu = document.getElementById("menu");
  const timerContainer = document.getElementById("timer-container");
  const timerDisplay = document.getElementById("timer-display");
  const timerAnimation = document.getElementById("timer-animation");
  const playPauseBtn = document.getElementById("btn-start-pause");
  const alarmSound = new Audio('assets/alarm.mp3');

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(currentSeconds);
  }

  function selectTimer(minutes) {
    totalSeconds = minutes * 60;
    currentSeconds = totalSeconds;
    menu.style.display = "none";
    timerContainer.style.display = "flex";
    updateDisplay();

    // animation
    timerAnimation.className = "menu-titulo";
    if (minutes === 10) {
      timerAnimation.classList.add("sprite-coffee-beans");
    } else if (minutes === 30) {
      timerAnimation.classList.add("sprite-cup-coffee");
    } else if (minutes === 60) {
      timerAnimation.classList.add("sprite-capuccino");
    }

    // pause animation initially
    timerAnimation.style.animationPlayState = "paused";

    // first button = "play"
    playPauseBtn.classList.remove("btn-pause");
    playPauseBtn.classList.add("btn-play");
  }

  function startPause() {
    if (!isRunning) {
      if (currentSeconds <= 0) return;
      isRunning = true;

      // start animation
      timerAnimation.style.animationPlayState = "running";

      interval = setInterval(() => {
        currentSeconds--;
        updateDisplay();
        if (currentSeconds <= 0) {
          clearInterval(interval);
          alarmSound.play();
          timerAnimation.style.animationPlayState = "paused";
          resetTimer();
        }
      }, 1000);

      playPauseBtn.classList.remove("btn-play");
      playPauseBtn.classList.add("btn-pause");

    } else {
      clearInterval(interval);
      isRunning = false;

      // pause animation
      timerAnimation.style.animationPlayState = "paused";

      playPauseBtn.classList.remove("btn-pause");
      playPauseBtn.classList.add("btn-play");
    }
  }

  function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    currentSeconds = totalSeconds;
    updateDisplay();

    // pause animation
    timerAnimation.style.animationPlayState = "paused";

    // back to "play" button
    playPauseBtn.classList.remove("btn-pause");
    playPauseBtn.classList.add("btn-play");
  }

  function backToMenu() {
    clearInterval(interval);
    isRunning = false;
    timerContainer.style.display = "none";
    menu.style.display = "block";
    timerAnimation.className = "menu-titulo";

    // pause animation
    timerAnimation.style.animationPlayState = "paused";

    // back to "play" button
    playPauseBtn.classList.remove("btn-pause");
    playPauseBtn.classList.add("btn-play");
  }

  // for html
  window.selectTimer = selectTimer;
  window.startPause = startPause;
  window.resetTimer = resetTimer;
  window.backToMenu = backToMenu;
});