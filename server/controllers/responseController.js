import Response from '../models/Response.js';
import Survey from '../models/Survey.js';
import mongoose from 'mongoose';

export const submitResponse = async (req, res) => {
  try {
    const { surveyId, answers } = req.body;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isActive) {
      return res.status(400).json({ message: 'Survey is not active' });
    }

    const response = await Response.create({
      surveyId,
      answers
    });

    // Update response count
    const updatedSurvey = await Survey.findByIdAndUpdate(surveyId, {
      $inc: { responseCount: 1 }
    }, { new: true });

    // Emit real-time update to all clients watching this survey
    req.io.to(`survey-${surveyId}`).emit('new-response', {
      surveyId,
      responseCount: updatedSurvey.responseCount,
      response: response
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSurveyResults = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const responses = await Response.find({ surveyId });

    // Process analytics data
    const analytics = {
      totalResponses: responses.length,
      questions: survey.questions.map(question => {
        const questionResponses = responses.map(response => 
          response.answers.find(answer => 
            answer.questionId.toString() === question._id.toString()
          )
        ).filter(Boolean);

        if (question.type === 'multiple-choice') {
          const optionCounts = {};
          question.options.forEach(option => {
            optionCounts[option] = questionResponses.filter(
              response => response.value === option
            ).length;
          });

          return {
            questionId: question._id,
            questionText: question.text,
            type: question.type,
            data: optionCounts
          };
        } else {
          return {
            questionId: question._id,
            questionText: question.text,
            type: question.type,
            data: questionResponses.map(response => response.value)
          };
        }
      })
    };

    res.json(analytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};