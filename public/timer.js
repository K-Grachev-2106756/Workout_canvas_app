const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const resumeBtn = document.getElementById("resume");
const display = document.getElementById("display");
const message = document.getElementById("message");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const inputs = document.getElementById("inputs");

let time = 0;
let timerInterval;

// Function to format time to hh:mm:ss format
function formatTime(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to start the timer
function startTimer() {  
    // Set the time
    time =
        parseInt(hoursInput.value || 0) * 3600 +
        parseInt(minutesInput.value || 0) * 60 +
        parseInt(secondsInput.value || 0);

    // Check if time is greater than 0
    if (time > 0) {
        // Disable the inputs
        hoursInput.disabled = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        // Hide the inputs
        inputs.style.display = "none";
        // Hide the start button
        startBtn.style.display = "none";
        // Show the pause and reset buttons
        pauseBtn.style.display = "block";
        resetBtn.style.display = "block";
        // Hide message
        message.textContent = "";
        message.style.display = "none";
        // Start the timer
        display.textContent = formatTime(time);
        timerInterval = setInterval(() => {
            time--;
            display.textContent = formatTime(time);
            if (time <= 0) {
                clearInterval(timerInterval);
                resumeBtn.style.display = "none";
                pauseBtn.style.display = "none";
                // alert("Time's up!");
                inputs.style.display = "none";
                hoursInput.value = "";
                minutesInput.value = "";
                secondsInput.value = "";
                resetBtn.style.display = "block";
                clearInterval(timerInterval);
                time = 0;
                display.textContent = "00:00:00";
                message.textContent = "Time's up!"
                message.style.display = "block";
            }
        }, 1000);
        } else {
            // message.style.display = "block";
            // message.textContent = "Please enter a valid time";
            // message.style.border = "";
        }
}

// Function to pause the timer
function pauseTimer() {
    // pause the timer
    clearInterval(timerInterval);
    // Show the continue button and hide the pause button
    resumeBtn.style.display = "block";
    pauseBtn.style.display = "none";
}

// Function to continue the timer
function resumeTimer() {
    // Enable the inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    // Hide the continue button
    resumeBtn.style.display = "none";
    // Show the pause button
    pauseBtn.style.display = "block";
    // Start the timer
    timerInterval = setInterval(() => {
        time--;
        display.textContent = formatTime(time);
        if (time <= 0) {
            pauseTimer();
            resumeBtn.style.display = "none";
        }
    }, 1000);
}

// Function to reset the timer
function resetTimer() {
    // pause the timer
    clearInterval(timerInterval);
    // Set the time to 0
    time = 0;
    // Enable the inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    // Show the inputs
    inputs.style.display = "flex";
    // Show the start button and hide the pause, reset, and continue buttons
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    resumeBtn.style.display = "none";
    // inputsContainer.classList.add("centered");
    // Reset the display text
    display.textContent = "00:00:00";
    message.textContent = "";
    message.style.border = "none";
}

// Add event listeners to buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
resumeBtn.addEventListener("click", resumeTimer);
