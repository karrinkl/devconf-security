/*
  Клиентская сторона защиты: список с сервера вставляется как текст.
  textContent не разбирает HTML, поэтому тег из ответа API не станет узлом.
  Очистка при этом всё равно делается на сервере до записи в базу.
*/
const list = document.getElementById('questions');

function card(question) {
  const article = document.createElement('article');
  article.className = 'card';

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${question.author} спрашивает ${question.speakerName}`;

  const text = document.createElement('p');
  text.className = 'text';
  text.textContent = question.text;

  article.append(meta, text);
  return article;
}

async function refresh() {
  const response = await fetch('/api/questions', { headers: { Accept: 'application/json' } });
  if (!response.ok) return;

  const body = await response.json();
  list.replaceChildren(...(body.data || []).map(card));
}

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    author: form.author.value,
    speakerName: form.speakerName.value,
    text: form.text.value,
  };

  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    window.alert((body.errors || [body.message || 'Не удалось сохранить вопрос']).join('\n'));
    return;
  }

  form.text.value = '';
  await refresh();
});
