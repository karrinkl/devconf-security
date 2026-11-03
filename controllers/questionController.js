const Question = require('../models/Question');
const Speaker = require('../models/Speaker');
const { sanitizePlainText } = require('../lib/sanitize');
const { renderQuestionsPage } = require('../views/questionsPage');

const LIMITS = {
  author: { min: 2, max: 80, label: 'Имя' },
  speakerName: { min: 2, max: 120, label: 'Имя спикера' },
  text: { min: 5, max: 1000, label: 'Вопрос' },
};

function readField(body, key) {
  const rule = LIMITS[key];
  const value = sanitizePlainText(body[key]);

  if (value.length < rule.min || value.length > rule.max) {
    return { error: `${rule.label}: от ${rule.min} до ${rule.max} символов после очистки` };
  }

  return { value };
}

function parseQuestion(body) {
  const author = readField(body, 'author');
  const speakerName = readField(body, 'speakerName');
  const text = readField(body, 'text');
  const errors = [author, speakerName, text].flatMap((field) => (field.error ? [field.error] : []));

  if (errors.length) {
    return { errors };
  }

  return {
    value: {
      author: author.value,
      speakerName: speakerName.value,
      text: text.value,
    },
  };
}

function wantsHtml(req) {
  return req.is('application/x-www-form-urlencoded');
}

async function loadPageData() {
  const [questions, speakers] = await Promise.all([
    Question.find().sort({ createdAt: -1 }).lean(),
    Speaker.find().sort({ name: 1 }).select('name').lean(),
  ]);

  return { questions, speakers };
}

/** GET /questions. Страница формы и уже заданных вопросов. */
async function showQuestionsPage(req, res, next) {
  try {
    const data = await loadPageData();
    res.status(200).type('html').send(renderQuestionsPage(data));
  } catch (error) {
    next(error);
  }
}

/** GET /api/questions */
async function getQuestions(req, res, next) {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/questions и POST /questions.
 * Текст очищается до записи в MongoDB.
 */
async function createQuestion(req, res, next) {
  try {
    const parsed = parseQuestion(req.body || {});

    if (parsed.errors) {
      if (wantsHtml(req)) {
        const data = await loadPageData();
        return res.status(400).type('html').send(renderQuestionsPage({
          ...data,
          errors: parsed.errors,
        }));
      }

      return res.status(400).json({
        message: 'Данные не прошли проверку',
        errors: parsed.errors,
      });
    }

    const question = await Question.create(parsed.value);

    if (wantsHtml(req)) {
      return res.redirect(303, '/questions');
    }

    return res.status(201).json({
      message: 'Вопрос сохранён',
      data: question,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showQuestionsPage,
  getQuestions,
  createQuestion,
};
