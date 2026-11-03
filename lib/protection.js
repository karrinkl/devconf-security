/**
 * Защита включена, пока процесс не запущен с SECURITY=off.
 * Этот режим нужен только для скриншота уязвимости «до».
 * Обычный запуск (npm run local) всегда с защитой.
 */
function isProtectionOn() {
  return process.env.SECURITY !== 'off';
}

module.exports = { isProtectionOn };
