let currentQuestionId = 'q1';
let currentLanguage = 'en';
let questionHistory = [];

async function fetchQuestion(id, language) {
  const res = await fetch(`/api/question?id=${id}&language=${language}`);
  return res.json();
}

function renderQuestion(q) {
  const container = document.getElementById('quiz');
 
  // const imagePath = q.is_result ? `images/${q.question}.jpg` : '';
  // const imagePath = q.is_result ? `images/${q.question.replace(/\s+/g, '_')}.jpg` : ''; // "Mai Tai" becomes "Mai_Tai.jpg".

  const imagePath = q.is_result ? 'images/MaiTai.jpg' : '';
  const surprise = currentLanguage === 'gr' ? 'Εκπληξη!' : 'Surprise Me!';

  container.innerHTML = `
    <div class="question">${q.question}</div>

    ${q.is_result ? `
      <div class="result-image">
        <img src="${imagePath}" alt="${q.question}" />
      </div>
      <div class="result-description">
        ${q.description || ''}
      </div>
    ` : ''}

    <div class="answers">
      ${q.options.map(opt => `
        <button onclick="handleAnswer('${opt.next_question_id}', '${opt.answer}', '${q.language}')">${opt.answer}</button>
      `).join('')}
    </div>

    ${q.id === 'q1' ? `
      <div class="random-button">
        <button onclick="showRandomResult('${q.language}')">🎲 ${surprise} 🎲</button>
      </div>
    ` : ''}

    ${
      questionHistory.length > 0
        ? `
          <div class="nav-buttons">
            <button onclick="goBack()" class="back-btn">Back</button>
            <button onclick="goHome()" class="home-btn">Home</button>
          </div>
        ` : ''
    }
  `;
}

async function handleAnswer(nextId, selectedAnswerText, language) {
  questionHistory.push(currentQuestionId);

  await fetch('/api/updateCount', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: currentQuestionId, answerText: selectedAnswerText, answerLanguage: language })
  });

  const next = await fetchQuestion(nextId, language);
  currentQuestionId = next.id;
  renderQuestion(next);
}

async function showRandomResult(language) {
  const res = await fetch(`/api/randomResult?language=${language}`);
  const randomResult = await res.json();

  questionHistory.push(currentQuestionId);
  currentQuestionId = randomResult.id;
  renderQuestion(randomResult);
}

function goBack() {
  if (questionHistory.length === 0) return;

  currentQuestionId = questionHistory.pop();

  fetchQuestion(currentQuestionId, currentLanguage).then(renderQuestion);
}

function goHome() {
  questionHistory = [];
  startQuiz();
}

function changeLanguage(language) {
  currentLanguage = language;
  startQuiz();
}

async function startQuiz() {
  const first = await fetchQuestion('q1', currentLanguage);
  currentQuestionId = first.id;
  renderQuestion(first);
}

startQuiz();
