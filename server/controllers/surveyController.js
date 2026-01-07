import Survey from '../models/Survey.js';
import Response from '../models/Response.js';

export const createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    const survey = await Survey.create({
      title,
      description,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(surveys);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSurvey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Survey.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ surveyId: req.params.id });

    res.json({ message: 'Survey deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleSurveyStatus = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.id,
      { isActive: !survey.isActive },
      { new: true }
    );

    res.json(updatedSurvey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};