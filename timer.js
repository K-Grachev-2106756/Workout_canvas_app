let intervalId;
let seconds = 0;
let minutes = 0;
let hours = 0;

function startTimer() {
  intervalId = setInterval(function() {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
    let timerDisplay = document.getElementById("timer");
    timerDisplay.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}
