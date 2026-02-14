const TOTAL_TIME_SECONDS = 60;
const ALPHABET_START_CODE = 65;
const ALPHABET_SIZE = 26;

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const timeLeftEl = document.getElementById("timeLeft");
const correctCountEl = document.getElementById("correctCount");
const incorrectCountEl = document.getElementById("incorrectCount");
const letterBoxEl = document.getElementById("letterBox");
const optionsEl = document.getElementById("options");

const finalCorrectEl = document.getElementById("finalCorrect");
const finalIncorrectEl = document.getElementById("finalIncorrect");

let timeLeft = TOTAL_TIME_SECONDS;
let correctCount = 0;
let incorrectCount = 0;
let timerId = null;
let currentAnswer = null;

function showScreen(screenToShow) {
  [homeScreen, gameScreen, resultScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  screenToShow.classList.add("active");
}

function randomLetterData() {
  const value = Math.floor(Math.random() * ALPHABET_SIZE) + 1;
  const letter = String.fromCharCode(ALPHABET_START_CODE + value - 1);
  return { letter, value };
}

function buildOptions(correctValue) {
  const values = new Set([correctValue]);
  while (values.size < 4) {
    values.add(Math.floor(Math.random() * ALPHABET_SIZE) + 1);
  }

  return Array.from(values).sort(() => Math.random() - 0.5);
}

function updateScoreboard() {
  timeLeftEl.textContent = String(timeLeft);
  correctCountEl.textContent = String(correctCount);
  incorrectCountEl.textContent = String(incorrectCount);
}

function renderQuestion() {
  const { letter, value } = randomLetterData();
  currentAnswer = value;
  letterBoxEl.textContent = letter;

  const optionValues = buildOptions(value);
  optionsEl.innerHTML = "";

  optionValues.forEach((optionValue) => {
    const button = document.createElement("button");
    button.className = "optionBtn";
    button.textContent = String(optionValue);
    button.type = "button";
    button.addEventListener("click", () => {
      if (optionValue === currentAnswer) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
      updateScoreboard();
      renderQuestion();
    });
    optionsEl.appendChild(button);
  });
}

function endGame() {
  clearInterval(timerId);
  timerId = null;

  finalCorrectEl.textContent = String(correctCount);
  finalIncorrectEl.textContent = String(incorrectCount);

  showScreen(resultScreen);
}

function startGame() {
  timeLeft = TOTAL_TIME_SECONDS;
  correctCount = 0;
  incorrectCount = 0;

  updateScoreboard();
  renderQuestion();
  showScreen(gameScreen);

  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateScoreboard();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);