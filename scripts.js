let score = 0;
const scoreDisplay = document.getElementById("score");
const waterLevel = document.getElementById("waterLevel");
const questionText = document.getElementById("questionText");

// Example questions (you can expand this list)
const questions = [
  { question: "Water is everywhere?", answer: true },
  { question: "Is saltwater safe to drink untreated?", answer: false },
  { question: "Do all humans need water to live?", answer: true },
  { question: "You can survive a month without water.", answer: false }
];

let currentIndex = 0;

function updateQuestion() {
  if (currentIndex >= questions.length) currentIndex = 0;
  questionText.textContent = questions[currentIndex].question;
}

function submitAnswer(userAnswer) {
  const correct = questions[currentIndex].answer === userAnswer;
  if (correct) {
    score++;
    updateWaterLevel();
  }
  currentIndex++;
  updateQuestion();
  scoreDisplay.textContent = score;
}

function updateWaterLevel() {
  const height = Math.min(score * 20, 100); // Max height = 100%
  waterLevel.style.height = `${height}%`;
}

document.getElementById("resetBtn").addEventListener("click", () => {
  score = 0;
  currentIndex = 0;
  scoreDisplay.textContent = score;
  waterLevel.style.height = "0";
  updateQuestion();
});

document.getElementById("rulesBtn").addEventListener("click", () => {
  alert("Answer questions correctly to fill your glass with fresh water. Each correct answer increases your score!");
});

updateQuestion();
