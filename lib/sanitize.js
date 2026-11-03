const sanitizeHtml = require('sanitize-html');

const { isProtectionOn } = require('./protection');

/**
 * Убирает HTML из строки, которую прислал пользователь.
 *
 * sanitize-html разбирает разметку как браузер, а не регулярным выражением.
 * Тег script выбрасывается вместе с кодом внутри, у остальных тегов
 * снимается разметка и остаётся текст. В базе нет HTML.
 *
 * В режиме SECURITY=off строка возвращается как есть. Так снимается
 * скриншот атаки до защиты. В отчёте и в обычном запуске этого режима нет.
 */
function sanitizePlainText(value) {
  const source = typeof value === 'string' ? value : '';

  if (!isProtectionOn()) {
    return source.trim();
  }

  return sanitizeHtml(source, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim();
}

/** Кодирует текст так, чтобы браузер показал его, а не выполнил. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { sanitizePlainText, escapeHtml };
