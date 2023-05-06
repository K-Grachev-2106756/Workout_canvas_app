let intervalId;
let timeLeft;

function startTimer() {
  let timeInput = document.getElementById("timeInput");
  timeLeft = parseInt(timeInput.value);
  
  updateDisplay(timeLeft);
  
  intervalId = setInterval(function() {
    timeLeft--;
    if (timeLeft <= 0) {
      stopTimer();
      setTimeout(function() {
        alert("Time's up!");
      }, 0);
    } else {
      updateDisplay(timeLeft);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function updateDisplay(timeLeft) {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let minutesStr = (minutes < 10) ? "0" + minutes : minutes;
  let secondsStr = (seconds < 10) ? "0" + seconds : seconds;
  let displayStr = minutesStr + ":" + secondsStr;
  
  let timerDisplay = document.getElementById("timerDisplay");
  timerDisplay.innerHTML = displayStr;
}
