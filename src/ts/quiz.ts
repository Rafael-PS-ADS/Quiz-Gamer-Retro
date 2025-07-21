interface Question {
  question: string;
  answers: string[];
  correct: number;
}

const allQuestions: Question[] = [
  {
    question: "Qual é o nome do encanador protagonista dos jogos da Nintendo?",
    answers: ["Luigi", "Sonic", "Mario", "Yoshi"],
    correct: 2
  },
  {
    question: "Em qual console foi lançado o primeiro jogo do Sonic?",
    answers: ["Super Nintendo", "Mega Drive", "PlayStation", "Nintendo 64"],
    correct: 1
  },
  {
    question: "Qual jogo é conhecido por 'It's dangerous to go alone! Take this.'?",
    answers: ["Final Fantasy", "The Legend of Zelda", "Metroid", "Chrono Trigger"],
    correct: 1
  },
  {
    question: "Quem é o principal vilão da franquia Donkey Kong?",
    answers: ["Bowser", "Ganondorf", "King K. Rool", "Wario"],
    correct: 2
  },
  {
    question: "Qual jogo popular começou como um mod de 'Warcraft III'?",
    answers: ["Overwatch", "League of Legends", "Dota", "Fortnite"],
    correct: 2
  }
];

class QuizGame {
  private questions: Question[];
  private currentQuestion: number = 0;
  private score: number = 0;
  private timerInterval?: number;

  constructor(questions: Question[]) {
    this.questions = questions;
    this.showQuestion();
    this.addCRTEffect();
  }

  private addCRTEffect(): void {
    document.body.classList.add('crt-effect');
  }

  private showQuestion(): void {
    this.clearTimer();
    const q = this.questions[this.currentQuestion];
    
    const quizContent = document.getElementById("quiz-content")!;
    quizContent.innerHTML = `
      <div class="question">${q.question}</div>
      <div id="answers"></div>
      <div class="feedback" id="feedback"></div>
      <div class="score" id="score"></div>
      <div class="timer" id="timer">⏱️ 15s</div>
    `;

    const answersDiv = document.getElementById("answers")!;
    answersDiv.innerHTML = "";

    q.answers.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.onclick = () => {
        this.clearTimer();
        this.checkAnswer(index);
      };
      answersDiv.appendChild(btn);
    });

    this.startTimer();
  }

  private startTimer(): void {
    let timeLeft = 15;
    const timerEl = document.getElementById("timer")!;
    
    this.timerInterval = window.setInterval(() => {
      timerEl.textContent = `⏱️ ${timeLeft}s`;
      timerEl.style.color = timeLeft <= 5 ? "#ff0000" : "#fff";
      
      if (timeLeft-- <= 0) {
        this.clearTimer();
        this.checkAnswer(-1); // Resposta automática (tempo esgotado)
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private checkAnswer(selected: number): void {
    const q = this.questions[this.currentQuestion];
    const feedbackEl = document.getElementById("feedback")!;

    if (selected === q.correct) {
      this.score++;
      feedbackEl.textContent = "✅ Resposta correta!";
      feedbackEl.style.color = "#0f0";
    } else {
      feedbackEl.textContent = selected === -1 
        ? "⌛ Tempo esgotado!" 
        : `❌ Errado! A resposta certa era: ${q.answers[q.correct]}`;
      feedbackEl.style.color = "#f00";
    }

    document.getElementById("score")!.textContent = 
      `Pontuação: ${this.score} / ${this.questions.length}`;

    this.currentQuestion++;
    
    if (this.currentQuestion < this.questions.length) {
      setTimeout(() => this.showQuestion(), 1500);
    } else {
      setTimeout(() => this.showFinalScreen(), 1500);
    }
  }

  private showFinalScreen(): void {
    const container = document.querySelector(".quiz-container")!;
    container.innerHTML = `
      <h1>🎉 Fim de Jogo!</h1>
      <p>Sua pontuação final foi: ${this.score} de ${this.questions.length}</p>
      <div class="game-img">
        <img src="./assets/mario.gif" alt="Mario Pixel">
      </div>
      <button onclick="location.reload()">Jogar Novamente</button>
    `;
  }
}

// Seleciona 5 perguntas aleatórias
const randomQuestions = [...allQuestions]
  .sort(() => Math.random() - 0.5)
  .slice(0, 5);

new QuizGame(randomQuestions);