const TOTAL_TIME_SECONDS = 60;
const ALPHABET_START_CODE = 65;
const ALPHABET_SIZE = 26;
const WRONG_HIGHLIGHT_MS = 300;

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
let questionLocked = false;
let gameActive = false;

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

function disableOptionButtons() {
  const buttons = optionsEl.querySelectorAll(".optionBtn");
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function renderQuestion() {
  questionLocked = false;

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
      if (questionLocked || !gameActive) {
        return;
      }

      questionLocked = true;
      disableOptionButtons();

      if (optionValue === currentAnswer) {
        correctCount += 1;
        updateScoreboard();
        if (gameActive) {
          renderQuestion();
        }
        return;
      }

      incorrectCount += 1;
      button.classList.add("wrong");
      updateScoreboard();

      setTimeout(() => {
        if (gameActive) {
          renderQuestion();
        }
      }, WRONG_HIGHLIGHT_MS);
    });
    optionsEl.appendChild(button);
  });
}

function endGame() {
  clearInterval(timerId);
  timerId = null;
  gameActive = false;
  questionLocked = true;

  finalCorrectEl.textContent = String(correctCount);
  finalIncorrectEl.textContent = String(incorrectCount);

  showScreen(resultScreen);
}

function startGame() {
  timeLeft = TOTAL_TIME_SECONDS;
  correctCount = 0;
  incorrectCount = 0;
  gameActive = true;
  questionLocked = false;

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