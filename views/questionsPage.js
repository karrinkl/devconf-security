const { escapeHtml } = require('../lib/sanitize');
const { isProtectionOn } = require('../lib/protection');

function field(question, key) {
  const value = question[key] || '';
  return isProtectionOn() ? escapeHtml(value) : value;
}

function renderQuestionsPage({ questions, speakers, errors = [] }) {
  const protectionOn = isProtectionOn();
  const errorBlock = errors.length
    ? `<ul class="errors">${errors.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';

  const speakerOptions = speakers.map((speaker) => {
    const name = escapeHtml(speaker.name);
    return `<option value="${name}">${name}</option>`;
  }).join('');

  const cards = questions.length
    ? questions.map((question) => `
      <article class="card">
        <p class="meta">${field(question, 'author')} спрашивает ${field(question, 'speakerName')}</p>
        <p class="text">${field(question, 'text')}</p>
      </article>`).join('')
    : '<p class="empty">Вопросов пока нет.</p>';

  const banner = protectionOn
    ? ''
    : '<p class="banner">Режим без защиты. Только для скриншота уязвимости. Обычный запуск: npm run local.</p>';

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вопрос спикеру — DEVCONF 2026</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <main class="wrap">
    <p class="eyebrow">DEVCONF 2026</p>
    <h1>Вопрос спикеру</h1>
    <p class="lead">Вопрос сохраняется на сервере и сразу показывается на этой странице.</p>
    ${banner}
    ${errorBlock}
    <form method="post" action="/questions">
      <label for="author">Ваше имя</label>
      <input id="author" name="author" required minlength="2" maxlength="80" autocomplete="name">

      <label for="speakerName">Спикер</label>
      <input id="speakerName" name="speakerName" list="speakers" required minlength="2" maxlength="120">
      <datalist id="speakers">${speakerOptions}</datalist>

      <label for="text">Вопрос</label>
      <textarea id="text" name="text" required minlength="5" maxlength="1000" rows="5"></textarea>

      <button type="submit">Отправить вопрос</button>
    </form>
    <section aria-labelledby="list-title">
      <h2 id="list-title">Заданные вопросы</h2>
      <div id="questions">${cards}</div>
    </section>
  </main>
  ${protectionOn ? '<script src="/questions.js"></script>' : ''}
</body>
</html>`;
}

module.exports = { renderQuestionsPage };
