const questionEl = document.querySelector("#question");
const optionsContainer = document.querySelector("#options-container");
const nextBtn = document.querySelector("#next-btn");
const restartBtn = document.querySelector("#restart-btn");
const progressText = document.querySelector("#progress-text");
const quizBox = document.querySelector("#quiz-box");
const resultBox = document.querySelector("#result-box");
const scoreText = document.querySelector("#score-text");
const loader = document.querySelector("#loader");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

async function fetchQuestions() {
  loader.classList.remove("hidden");
  quizBox.classList.add("hidden");
  resultBox.classList.add("hidden");
  progressText.textContent = "Loading questions...";

  try {
    const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
    const data = await res.json();
    questions = data.results.map((q) => {
      const formattedQuestion = {
        question: decodeHTML(q.question),
        correctAnswer: decodeHTML(q.correct_answer),
        options: [...q.incorrect_answers.map((ans) => decodeHTML(ans))],
      };
      const randomIndex = Math.floor(Math.random() * 4);
      formattedQuestion.options.splice(randomIndex, 0, formattedQuestion.correctAnswer);
      return formattedQuestion;
    });

    currentQuestionIndex = 0;
    score = 0;
    loader.classList.add("hidden");
    quizBox.classList.remove("hidden");
    loadQuestion();
  } catch (error) {
    loader.classList.add("hidden");
    progressText.textContent = "Error loading questions. Please try again.";
  }
}

function loadQuestion() {
  const current = questions[currentQuestionIndex];
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionEl.textContent = current.question;
  optionsContainer.innerHTML = "";
  nextBtn.classList.add("hidden");

  current.options.forEach((opt) => {
    const button = document.createElement("button");
    button.textContent = opt;
    button.classList.add("option-btn");
    button.addEventListener("click", () => selectOption(button, current.correctAnswer));
    optionsContainer.appendChild(button);
  });
}

function selectOption(selectedBtn, correctAnswer) {
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    }
  });

  if (selectedBtn.textContent === correctAnswer) {
    score++;
  } else {
    selectedBtn.classList.add("wrong");
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  progressText.textContent = "Completed!";
  scoreText.textContent = `You scored ${score} out of ${questions.length}!`;
}

restartBtn.addEventListener("click", fetchQuestions);

fetchQuestions();