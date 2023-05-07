let timerInterval;
let seconds = 0, minutes = 0, hours = 0;
const stopwatch = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

function startTimer() {
	startBtn.textContent = "STOP";
	startBtn.id = ("start");
	startBtn.id = ("stop");
	startBtn.removeEventListener("click", startTimer);
	startBtn.addEventListener("click", stopTimer);

	timerInterval = setInterval(function() {
		seconds++;
		if (seconds == 60) {
			seconds = 0;
			minutes++;
		}
		if (minutes == 60) {
			minutes = 0;
			hours++;
		}
		stopwatch.textContent = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
	}, 1000);
}

function stopTimer() {
	startBtn.textContent = "START";
	startBtn.id = ("stop");
	startBtn.id = ("start");
	startBtn.removeEventListener("click", stopTimer);
	startBtn.addEventListener("click", startTimer);

	clearInterval(timerInterval);
}

function resetTimer() {
	seconds = 0;
	minutes = 0;
	hours = 0;
	stopwatch.textContent = "00:00:00";
	stopTimer();
}

function pad(num) {
	return num < 10 ? "0" + num : num;
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
