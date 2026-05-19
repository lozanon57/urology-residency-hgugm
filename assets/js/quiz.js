/* ============================================================
   quiz.js — Consolidation Questions (Tutor Mode)
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

/* ── Answer Shuffler (Fisher-Yates) ─────────────────────────── */
/**
 * Randomises option order on every question render.
 * Remaps the correct answer key and all wrong-explanation keys
 * so the quiz logic stays correct.
 */
function shuffleOptions(question) {
  const entries = Object.entries(question.options || {});

  // Fisher-Yates shuffle
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }

  const newKeys = ['A', 'B', 'C', 'D'];
  const keyMap  = {};            // old key → new key
  const shuffledOptions = {};

  entries.forEach(([oldKey, text], idx) => {
    const newKey = newKeys[idx];
    keyMap[oldKey] = newKey;
    shuffledOptions[newKey] = text;
  });

  // Remap correct answer
  const newCorrect = keyMap[question.correct] || question.correct;

  // Remap wrong explanations
  const oldWrong = (question.explanation && question.explanation.wrong) || {};
  const newWrong = {};
  Object.entries(oldWrong).forEach(([k, v]) => {
    const mapped = keyMap[k];
    if (mapped) newWrong[mapped] = v;
  });

  return {
    ...question,
    options: shuffledOptions,
    correct: newCorrect,
    _original_correct: question.correct,  // kept for spaced-repetition ID stability
    explanation: {
      ...question.explanation,
      wrong: newWrong
    }
  };
}

/* ── Difficulty Label ────────────────────────────────────────── */
function difficultyBadge(level) {
  const map = {
    1: { dots: '●○○', label: 'Foundation',    cls: 'diff-1' },
    2: { dots: '●●○', label: 'Intermediate',  cls: 'diff-2' },
    3: { dots: '●●●', label: 'Advanced',      cls: 'diff-3' },
  };
  const d = map[level] || map[1];
  return `<span class="difficulty-badge ${d.cls}" aria-label="Difficulty: ${d.label}">
    <span aria-hidden="true">${d.dots}</span> ${d.label}
  </span>`;
}

/* ── Quiz Object ─────────────────────────────────────────────── */
const Quiz = {

  /* ── Init ────────────────────────────────────────────────── */
  initChapterQuiz(chapter) {
    const mount = document.getElementById('quizMount');
    if (!mount) return;

    const rawQuestions = chapter.consolidation && chapter.consolidation.questions;
    if (!rawQuestions || !rawQuestions.length) {
      mount.innerHTML = `<p class="text-muted" style="text-align:center; padding:20px 0;">No questions available for this chapter yet.</p>`;
      return;
    }

    this._chapter   = chapter;
    this._rawQuestions = rawQuestions;   // original, unshuffled
    this._questions = rawQuestions;      // will be shuffled per question
    this._currentIdx = 0;
    this._results    = [];
    this._attempts   = {};               // questionId → attempt count

    this.renderQuestion(mount, 0);
  },

  /* ── Render Question ─────────────────────────────────────── */
  renderQuestion(mount, idx) {
    // Apply option shuffle on every render (randomised each time)
    const rawQ = this._rawQuestions[idx];
    const q    = shuffleOptions(rawQ);

    // Store shuffled version for selectAnswer access
    this._currentShuffled = q;

    const total = this._rawQuestions.length;

    const dots = this._rawQuestions.map((_, i) => {
      let cls = 'quiz-dot';
      if (i < this._results.length) {
        cls += this._results[i] ? ' correct' : ' wrong';
      } else if (i === idx) {
        cls += ' current';
      }
      return `<div class="${cls}"></div>`;
    }).join('');

    const diff = q.difficulty ? difficultyBadge(q.difficulty) : '';

    const optionsHtml = Object.entries(q.options || {}).map(([key, val]) =>
      `<button class="option-btn" data-key="${key}" onclick="Quiz.selectAnswer('${key}', this)">
        <span class="option-letter">${key}</span>
        <span>${val}</span>
      </button>`
    ).join('');

    mount.innerHTML = `
      <div class="quiz-container" id="quizContainer">
        <div class="quiz-header">
          <span style="font-size:0.82rem; color:var(--muted); font-weight:600;">Question ${idx + 1} of ${total}</span>
          <div class="quiz-header-right">
            ${diff}
            <div class="quiz-progress-dots">${dots}</div>
          </div>
        </div>

        <div class="question-stem">${q.stem}</div>

        <div class="options-list" id="optionsList">
          ${optionsHtml}
        </div>

        <div class="explanation-panel" id="explanationPanel">
          <div class="explanation-section">
            <div class="explanation-label">✅ Correct Answer: ${q.correct}</div>
            <div class="explanation-text">${q.explanation ? this._parseInline(q.explanation.correct || '') : ''}</div>
          </div>

          ${this._renderWrongExplanations(q)}

          ${q.explanation && q.explanation.guideline ? `
            <div class="explanation-section">
              <div class="explanation-label">📋 Guideline Reference</div>
              <div class="explanation-text">${q.explanation.guideline}</div>
            </div>` : ''}

          ${q.explanation && q.explanation.trial ? `
            <div class="explanation-section">
              <div class="explanation-label">🔬 Landmark Trial</div>
              <div class="explanation-text">${q.explanation.trial}</div>
            </div>` : ''}

          ${q.explanation && q.explanation.pearl ? `
            <div class="explanation-section">
              <div class="explanation-label">🔑 Clinical Pearl</div>
              <div class="explanation-text">${q.explanation.pearl}</div>
            </div>` : ''}

          <div style="margin-top:20px; text-align:right;">
            ${idx < this._rawQuestions.length - 1
              ? `<button class="btn btn-primary" onclick="Quiz.nextQuestion()">Next Question →</button>`
              : `<button class="btn btn-teal" onclick="Quiz.showSummary()">See Results</button>`}
          </div>
        </div>
      </div>
    `;

    // Apply abbreviation tooltips to quiz question
    if (typeof applyAbbreviationTooltips === 'function') {
      applyAbbreviationTooltips(mount);
    }
  },

  /* ── Select Answer ───────────────────────────────────────── */
  selectAnswer(key, btn) {
    const q       = this._currentShuffled;
    const correct = q.correct;
    const isCorrect = key === correct;

    document.querySelectorAll('.option-btn').forEach(b => {
      b.disabled = true;
      if (b.dataset.key === correct) b.classList.add('correct');
      else if (b.dataset.key === key && !isCorrect) b.classList.add('wrong');
    });

    this._results.push(isCorrect);

    // Spaced repetition scheduling
    const qId = q.id || `${this._chapter.id}-Q${this._currentIdx}`;
    const attempts = (this._attempts[qId] || 0);
    this._attempts[qId] = attempts + 1;
    if (typeof Progress !== 'undefined' && Progress.scheduleReview) {
      Progress.scheduleReview(qId, isCorrect, attempts);
    }

    const panel = document.getElementById('explanationPanel');
    if (panel) {
      panel.classList.add('visible');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  /* ── Next Question ───────────────────────────────────────── */
  nextQuestion() {
    this._currentIdx++;
    const mount = document.getElementById('quizMount');
    if (mount) this.renderQuestion(mount, this._currentIdx);
  },

  /* ── Show Summary ────────────────────────────────────────── */
  showSummary() {
    const score    = this._results.filter(Boolean).length;
    const total    = this._rawQuestions.length;
    const pct      = Math.round((score / total) * 100);
    const chapterId = this._chapter.id;

    Progress.saveQuizScore(chapterId, score, total);

    const medal = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📖';
    const msg = pct >= 80
      ? 'Excellent! You have a strong grasp of this material.'
      : pct >= 60
        ? 'Good effort. Review the explanations for any questions you missed.'
        : 'Consider re-reading the chapter before retrying the quiz.';

    const dots = this._results.map(r =>
      `<div class="quiz-dot ${r ? 'correct' : 'wrong'}"></div>`
    ).join('');

    const mount = document.getElementById('quizMount');
    mount.innerHTML = `
      <div class="quiz-container">
        <div style="text-align:center; padding:32px 20px;">
          <div style="font-size:4rem; margin-bottom:16px;">${medal}</div>
          <h3 style="font-size:1.5rem; color:var(--navy); margin-bottom:8px;">${score} / ${total} Correct</h3>
          <p class="text-muted" style="margin-bottom:20px;">${msg}</p>
          <div class="quiz-progress-dots" style="justify-content:center; margin-bottom:24px;">${dots}</div>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="Quiz.retryQuiz()">Retry Quiz</button>
            <a href="#/curriculum" class="btn btn-primary">Back to Curriculum</a>
          </div>
        </div>
      </div>
    `;
  },

  /* ── Retry ───────────────────────────────────────────────── */
  retryQuiz() {
    this._currentIdx = 0;
    this._results    = [];
    const mount = document.getElementById('quizMount');
    if (mount) this.renderQuestion(mount, 0);
  },

  /* ── Wrong Explanations ──────────────────────────────────── */
  _renderWrongExplanations(q) {
    const wrongExp = q.explanation && q.explanation.wrong;
    if (!wrongExp || typeof wrongExp !== 'object') return '';

    const items = Object.entries(wrongExp)
      .filter(([key]) => key !== q.correct)
      .map(([key, text]) =>
        `<div style="margin-bottom:8px;">
          <strong style="color:var(--error);">Option ${key}:</strong>
          <span class="explanation-text"> ${text}</span>
        </div>`
      ).join('');

    return items ? `
      <div class="explanation-section">
        <div class="explanation-label">❌ Why Other Options Are Incorrect</div>
        ${items}
      </div>` : '';
  },

  /* ── Inline Parse ────────────────────────────────────────── */
  _parseInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }
};
