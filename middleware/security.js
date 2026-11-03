const helmet = require('helmet');

const { isProtectionOn } = require('../lib/protection');

/**
 * Заголовки Helmet и базовая CSP.
 *
 * script-src 'self' запрещает и вставленный скрипт, и обработчик
 * onerror, даже если очистка на входе когда-нибудь пропустит разметку.
 *
 * HSTS выключен: стенд открывается по http://localhost. Заголовок
 * Strict-Transport-Security заставил бы браузер ходить на localhost
 * только по HTTPS, и страница перестала бы открываться.
 *
 * Cross-Origin-Resource-Policy оставлен cross-origin, чтобы клиент
 * лендинга с другого порта по-прежнему мог читать /api/speakers.
 * В режиме SECURITY=off CSP снимается: иначе скриншот «до» невозможен.
 */
function securityHeaders() {
  if (!isProtectionOn()) {
    return helmet({
      contentSecurityPolicy: false,
      strictTransportSecurity: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    });
  }

  return helmet({
    strictTransportSecurity: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  });
}

module.exports = { securityHeaders };
