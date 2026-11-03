const express = require('express');

const { getQuestions, createQuestion } = require('../controllers/questionController');

const router = express.Router();

router.route('/').get(getQuestions).post(createQuestion);

module.exports = router;
