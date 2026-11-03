require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const speakerRoutes = require('./routes/speakerRoutes');
const questionRoutes = require('./routes/questionRoutes');
const { showQuestionsPage, createQuestion } = require('./controllers/questionController');
const { securityHeaders } = require('./middleware/security');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { isProtectionOn } = require('./lib/protection');

const app = express();

app.use(securityHeaders());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'DEVCONF 2026 API',
    protection: isProtectionOn(),
    endpoints: ['/api/speakers', '/api/questions', '/questions'],
  });
});

app.get('/questions', showQuestionsPage);
app.post('/questions', createQuestion);

app.use('/api/speakers', speakerRoutes);
app.use('/api/questions', questionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}/questions`);
    console.log(isProtectionOn() ? 'Защита включена' : 'Защита выключена (SECURITY=off)');
  });
}

start();

module.exports = app;
