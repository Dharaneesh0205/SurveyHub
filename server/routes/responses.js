import express from 'express';
import { protect } from '../middleware/auth.js';
import { responseLimiter } from '../middleware/rateLimiter.js';
import { submitResponse, getSurveyResults } from '../controllers/responseController.js';

const router = express.Router();

router.post('/', responseLimiter, submitResponse);
router.get('/results/:surveyId', protect, getSurveyResults);

export default router;