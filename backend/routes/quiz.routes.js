import { Router } from 'express';
import quizController from '../controllers/quiz.controller.js';

const router = Router();

router.get('/generate', quizController.generateQuiz);
router.post('/submit', quizController.submitAnswer);

export default router;
