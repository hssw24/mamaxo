document.addEventListener("DOMContentLoaded", function () {
    const question = document.getElementById("question");
    const buttonsContainer = document.getElementById("buttons-container");
    const statsContainer = document.getElementById("stats");
    const logContainer = document.getElementById("log");
    const restartButton = document.createElement("button");
    restartButton.textContent = "Nochmal spielen?";
    restartButton.style.display = "none";
    restartButton.style.marginTop = "20px";
    restartButton.style.padding = "10px";
    restartButton.style.fontSize = "18px";
    restartButton.style.cursor = "pointer";
    restartButton.style.border = "1px solid #ccc";
    restartButton.style.borderRadius = "5px";
    restartButton.style.backgroundColor = "#4CAF50";
    restartButton.style.color = "white";
    document.body.appendChild(restartButton);

    buttonsContainer.style.display = "grid";
    buttonsContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(80px, 1fr))";
    buttonsContainer.style.gap = "10px";
    buttonsContainer.style.justifyContent = "center";
    
    let correctAnswer = 0;
    let lastNumber = null;
    let correctCount = 0;
    let incorrectCount = 0;
    let startTime = Date.now();
    let questionCounts = {};
    let totalQuestions = 10 * 3; // Jede Aufgabe 3-mal abfragen

    function updateStats() {
        let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        statsContainer.textContent = `Richtig: ${correctCount} | Falsch: ${incorrectCount} | Zeit: ${elapsedTime}s`;
    }

    function logIncorrectAnswer(givenAnswer, correctAnswer) {
        let logEntry = document.createElement("p");
        logEntry.textContent = `Falsch: ${givenAnswer}, Richtig: ${correctAnswer}`;
        logContainer.prepend(logEntry);
    }

    function generateQuestion() {
        if (Object.values(questionCounts).reduce((a, b) => a + b, 0) >= totalQuestions) {
            endGame();
            return;
        }

        let number;
        do {
            number = Math.floor(Math.random() * 10) + 1;
        } while (number === lastNumber || (questionCounts[number] && questionCounts[number] >= 3));
        
        lastNumber = number;
        correctAnswer = number * 5;
        questionCounts[number] = (questionCounts[number] || 0) + 1;
        question.textContent = `${number} × 5 = ?`;
        generateAnswerButtons();
    }

    function generateAnswerButtons() {
        buttonsContainer.innerHTML = "";
        let answers = Array.from({ length: 10 }, (_, i) => (i + 1) * 5);
        
        answers.forEach(answer => {
            let button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("answer-button");
            button.style.padding = "10px";
            button.style.fontSize = "18px";
            button.style.cursor = "pointer";
            button.style.border = "1px solid #ccc";
            button.style.borderRadius = "5px";
            button.style.backgroundColor = "#f0f0f0";
            button.addEventListener("click", function () {
                if (answer === correctAnswer) {
                    correctCount++;
                    generateQuestion();
                } else {
                    incorrectCount++;
                    logIncorrectAnswer(answer, correctAnswer);
                }
                updateStats();
            });
            buttonsContainer.appendChild(button);
        });
    }

    function endGame() {
        question.textContent = "Übung beendet!";
        buttonsContainer.innerHTML = "";
        restartButton.style.display = "block";
    }

    restartButton.addEventListener("click", function () {
        correctCount = 0;
        incorrectCount = 0;
        startTime = Date.now();
        questionCounts = {};
        restartButton.style.display = "none";
        logContainer.innerHTML = "";
        generateQuestion();
        updateStats();
    });

    generateQuestion();
    updateStats();
});
