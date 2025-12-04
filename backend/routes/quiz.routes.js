const { Router } = require('express');
const router = Router();
const quizController = require('../controllers/quiz.controller');

router.get('/generate', quizController.generateQuiz);
router.post('/submit', quizController.submitAnswer);

module.exports = router;
