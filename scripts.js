let score = 0;
let currentQuestion = 0;

const questions = [
  { text: "Turning off the tap while brushing your teeth saves water.", answer: true },
  { text: "Most of Earth's fresh water is stored in glaciers and ice caps.", answer: true },
  { text: "It is okay to pour chemicals or oil down the drain.", answer: false },
  { text: "Fixing leaks at home can help conserve water.", answer: true },
  { text: "Plants do not need water to grow.", answer: false },
  { text: "Taking shorter showers helps reduce water waste.", answer: true },
  { text: "Bottled water is always safer than tap water.", answer: false },
  { text: "Collecting rainwater can be used for watering gardens.", answer: true },
  { text: "Water pollution does not affect humans.", answer: false },
  { text: "Reusing and recycling water is important for sustainability.", answer: true }
];

function playClap() {
  // Use a short public domain clap sound
  let clap = document.getElementById('clap-audio');
  if (!clap) {
    clap = document.createElement('audio');
    clap.id = 'clap-audio';
    clap.src = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa1c82.mp3';
    clap.preload = 'auto';
    document.body.appendChild(clap);
  }
  clap.currentTime = 0;
  clap.play();
}

function showConfetti() {
  // Simple confetti using canvas-confetti CDN
  if (!document.getElementById('confettiScript')) {
    const script = document.createElement('script');
    script.id = 'confettiScript';
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
      confetti();
      playClap();
    };
    document.body.appendChild(script);
  } else if (window.confetti) {
    confetti();
    playClap();
  }
}

function hideQASection() {
  const questionSection = document.querySelector('.question');
  const instruction = document.querySelector('.instruction');
  if (questionSection) questionSection.style.display = 'none';
  if (instruction) instruction.style.display = 'none';
}

function showEndMessage(msg, color = "#00b4d8") {
  let winMsg = document.getElementById('winMessage');
  if (!winMsg) {
    winMsg = document.createElement('div');
    winMsg.id = 'winMessage';
    const main = document.querySelector('main, .main-content');
    if (main) main.appendChild(winMsg);
  }
  winMsg.textContent = msg;
  winMsg.style.fontSize = "2rem";
  winMsg.style.fontWeight = "bold";
  winMsg.style.color = color;
  winMsg.style.margin = "2rem 0";
  winMsg.style.display = "block";
}

function hideWinMessage() {
  const winMsg = document.getElementById('winMessage');
  if (winMsg) winMsg.style.display = "none";
}

function showWinMessage() {
  let winMsg = document.getElementById('winMessage');
  if (!winMsg) {
    winMsg = document.createElement('div');
    winMsg.id = 'winMessage';
    winMsg.textContent = "Great job, you won!";
    winMsg.style.fontSize = "2rem";
    winMsg.style.fontWeight = "bold";
    winMsg.style.color = "#00b4d8";
    winMsg.style.margin = "2rem 0";
    const main = document.querySelector('main, .main-content');
    if (main) main.appendChild(winMsg);
  } else {
    winMsg.textContent = "Great job, you won!";
    winMsg.style.display = "block";
  }
}

function updateQuestion() {
  const questionText = document.getElementById("questionText");
  if (currentQuestion >= questions.length) {
    // Game over
    const maxScore = questions.length * 10;
    const percent = score / maxScore;
    const waterFill = document.getElementById("waterFill");
    const waterColor = waterFill ? waterFill.getAttribute("fill") : "";
    // Win if 60% or higher and blue water
    if (percent >= 0.6 && waterColor === "#00bfff") {
      hideQASection();
      showWinMessage();
      showConfetti();
    } else if (percent < 0.6 && waterColor === "#00bfff") {
      hideQASection();
      showEndMessage("You didn't get it this time, but keep trying", "#ff9800");
    } else if (percent < 0.6 && waterColor === "#00ff66") {
      hideQASection();
      showEndMessage("Uh No! Try again", "#e53935");
    } else if (percent >= 0.6 && waterColor === "#00ff66") {
      hideQASection();
      showEndMessage("So close, try again", "#ffb300");
    } else {
      if (questionText) questionText.innerText = "You've completed the game!";
      hideWinMessage();
    }
    return;
  }
  hideWinMessage();
  questionText.innerText = questions[currentQuestion].text;
}

function updateWater(fillPercent, color) {
  // fillPercent: 0 (empty) to 1 (full)
  const maxHeight = 130;
  const minY = 18;
  const maxY = 148;
  const fillHeight = maxHeight * fillPercent;
  const y = maxY - fillHeight;
  const waterFill = document.getElementById("waterFill");
  const waterEllipse = document.getElementById("waterEllipse");
  waterFill.setAttribute("height", fillHeight);
  waterFill.setAttribute("y", y);
  waterFill.setAttribute("fill", color);
  waterEllipse.setAttribute("fill", color);
}

function submitAnswer(userAnswer) {
  if (currentQuestion >= questions.length) return;
  const correct = questions[currentQuestion].answer;
  let color;
  if (userAnswer === correct) {
    score += 10;
    color = "#00bfff"; // blue
  } else {
    score = Math.max(0, score - 10);
    color = "#00ff66"; // green
  }
  document.getElementById("score").innerText = score;
  const maxScore = questions.length * 10;
  const percent = Math.min((score / maxScore), 1);
  updateWater(percent, color);
  currentQuestion++;
  updateQuestion();
}

document.getElementById("resetBtn").onclick = function () {
  score = 0;
  currentQuestion = 0;
  document.getElementById("score").innerText = "0";
  updateWater(0, "#00bfff");
  // Restore question and answer section
  const questionSection = document.querySelector('.question');
  const instruction = document.querySelector('.instruction');
  if (questionSection) questionSection.style.display = '';
  if (instruction) instruction.style.display = '';
  hideWinMessage();
  updateQuestion();
};

window.onload = function() {
  updateWater(0, "#00bfff");
  updateQuestion();

  // Show popup on page load
  const popup = document.getElementById("rulesPopup");
  if (popup) {
    popup.classList.add("active");
  }

  document.getElementById("rulesBtn").onclick = function () {
    if (popup) {
      popup.classList.add("active");
    }
  };

  document.getElementById("closeRulesBtn").onclick = function () {
    if (popup) {
      popup.classList.remove("active");
    }
  };
};
