import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSurvey,
  getSurveys,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  toggleSurveyStatus
} from '../controllers/surveyController.js';

const router = express.Router();

router.route('/')
  .post(protect, createSurvey)
  .get(protect, getSurveys);

router.patch('/:id/toggle-status', protect, toggleSurveyStatus);

router.route('/:id')
  .get(getSurvey)
  .put(protect, updateSurvey)
  .delete(protect, deleteSurvey);

export default router;