let currentQuizBoxIndex = 0;
let answeredQuestions = 0;

const buttonSection = document.querySelector(".start-button-section");
const startButton = document.querySelector(".start-button-section button");
const restartButtonSection = document.querySelector(".restart-button-section");
const restartMessage = document.querySelector(".restart-button-section > div");
const restartButton = document.querySelector(
  ".restart-button-section > button"
);
const quizSection = document.querySelector(".quiz-section");
const quizBoxes = document.querySelectorAll(".quiz-section .question-box");
let currentQuestionNumberElement = quizBoxes[currentQuizBoxIndex].querySelector(
  "header .question-number"
);
let currentTimer = quizBoxes[currentQuizBoxIndex].querySelector(".time > span");
let currentChoices = quizBoxes[currentQuizBoxIndex].querySelectorAll(
  ".choices-container .choice"
);
let currentSubmitButtons = quizBoxes[currentQuizBoxIndex].querySelector(
  ".buttons .submit-button"
);
let currentNextButtons = quizBoxes[currentQuizBoxIndex].querySelector(
  ".buttons .next-button"
);
let isAnswered = false;

let questionsTotal = quizBoxes.length;
let timerInterval;
const timerDuration = 10;

// Make Functions
function start() {
  buttonSection.classList.remove("active");
  quizSection.classList.add("active");
  quizBoxes.forEach((quizBox) => {
    quizBox.classList.remove("active");
  });
  quizBoxes[currentQuizBoxIndex].classList.add("active");
  currentQuestionNumberElement.textContent = `${
    currentQuizBoxIndex + 1
  } Of ${questionsTotal} Questions`;

  startTimer();
}

function startTimer() {
  currentTimer.textContent = timerDuration;

  timerInterval = setInterval(function () {
    currentTimer.textContent--;
    if (currentTimer.textContent <= 0) {
      clearInterval(timerInterval);
      currentChoices.forEach((choice) => {
        choice.style.pointerEvents = "none";
      });
      submit();
      isAnswered = true;
    }
  }, 1000);
}

function choose() {
  currentChoices.forEach((choice) => choice.classList.remove("chosen"));
  this.classList.add("chosen");
}

function submit() {
  let somethingIsChosen = false;
  currentChoices.forEach((choice) => {
    if (choice.classList.contains("chosen")) somethingIsChosen = true;
  });
  if (!somethingIsChosen) {
    customAlert("No Answer Was Chosen");
    return;
  }

  isAnswered = true;

  currentChoices.forEach((choice) => {
    choice.style.pointerEvents = "none";

    if (!choice.classList.contains("chosen")) return;
    if (choice.id === "right-answer") {
      if (choice.classList.contains("right-answer")) return;
      choice.classList.add("right-answer");
      answeredQuestions++;
    } else {
      choice.classList.add("wrong-answer");
      currentChoices.forEach((otherChoice) => {
        if (otherChoice.id === "right-answer")
          otherChoice.classList.add("right-answer");
      });
    }
  });
  clearInterval(timerInterval);
}

function next() {
  if (!isAnswered) {
    customAlert("Answer This Question First");
    return;
  }

  if (currentQuizBoxIndex + 1 === questionsTotal) {
    restartMessage.textContent = `Your score is ${answeredQuestions} out of ${questionsTotal}`;
    quizSection.classList.remove("active");
    restartButtonSection.classList.add("active");
    return;
  }

  isAnswered = false;
  quizBoxes.forEach((quizBox) => {
    quizBox.classList.remove("active");
  });
  currentQuizBoxIndex++;
  quizBoxes[currentQuizBoxIndex].classList.add("active");

  // Reassigning the current elements for the quiz box
  reassigningCurrentElements();

  startButton.addEventListener("click", start);
  currentChoices.forEach((choice) => {
    choice.addEventListener("click", choose);
  });
  currentSubmitButtons.addEventListener("click", submit);
  currentNextButtons.addEventListener("click", next);

  start();
}

function reassigningCurrentElements() {
  currentQuestionNumberElement = quizBoxes[currentQuizBoxIndex].querySelector(
    "header .question-number"
  );
  currentTimer = quizBoxes[currentQuizBoxIndex].querySelector(".time > span");
  currentChoices = quizBoxes[currentQuizBoxIndex].querySelectorAll(
    ".choices-container .choice"
  );
  currentSubmitButtons = quizBoxes[currentQuizBoxIndex].querySelector(
    ".buttons .submit-button"
  );
  currentNextButtons = quizBoxes[currentQuizBoxIndex].querySelector(
    ".buttons .next-button"
  );
}

function reset() {
  restartButtonSection.classList.remove("active");
  currentQuizBoxIndex = 0;
  answeredQuestions = 0;
  isAnswered = false;
  quizBoxes.forEach((quizBox) => {
    quizBox
      .querySelectorAll(".choices-container > .choice")
      .forEach((choice) => {
        choice.classList.remove("right-answer");
        choice.classList.remove("wrong-answer");
        choice.classList.remove("chosen");
        choice.style.pointerEvents = "all";
      });
  });
  reassigningCurrentElements();
  start();
}

function customAlert(message, duration = 5000) {
  const alertBox = document.getElementById("custom-alert");
  alertBox.innerHTML = message;
  alertBox.style.display = "block";
  setTimeout(function () {
    alertBox.style.display = "none";
  }, duration);
}

// Hooking functions up with the elements
startButton.addEventListener("click", start);
currentChoices.forEach((choice) => {
  choice.addEventListener("click", choose);
});
currentSubmitButtons.addEventListener("click", submit);
currentNextButtons.addEventListener("click", next);
restartButton.addEventListener("click", reset);
