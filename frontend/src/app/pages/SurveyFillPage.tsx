import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { useApp } from '../AppContext';
import { ClipboardList, Lock } from 'lucide-react';
import { Survey } from '../types';
import { toast } from 'sonner';
import apiService from '../../services/api';

export function SurveyFillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addResponse } = useApp();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (id) {
          const surveyData = await apiService.getSurvey(id);
          setSurvey({
            id: surveyData._id,
            title: surveyData.title,
            description: surveyData.description,
            questions: surveyData.questions.map((q: any) => ({
              id: q._id,
              text: q.text,
              type: q.type,
              options: q.options,
              required: q.required
            })),
            createdAt: new Date(surveyData.createdAt).toISOString().split('T')[0],
            responseCount: surveyData.responseCount,
            isActive: surveyData.isActive
          });
        }
      } catch (error) {
        toast.error('Survey not found');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-lg">
          <p className="text-gray-600">Loading survey...</p>
        </Card>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-lg">
          <h1 className="text-2xl text-gray-900 mb-4">Survey Not Found</h1>
          <p className="text-gray-600 mb-6">
            The survey you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  if (!survey.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-lg text-center">
          <div className="bg-gray-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-4">Survey Closed</h1>
          <p className="text-gray-600 mb-6">
            This survey is no longer accepting responses. Thank you for your interest.
          </p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions
    const requiredQuestions = survey.questions.filter((q) => q.required);
    const missingAnswers = requiredQuestions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === ''
    );

    if (missingAnswers.length > 0) {
      toast.error('Please answer all required questions');
      return;
    }

    try {
      const answersArray = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      await addResponse(survey.id, answersArray);
      
      // Show thank you message
      setAnswers({});
      navigate('/thank-you');
    } catch (error) {
      // Error is already handled in AppContext with toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#4F46E5] p-3 rounded-xl">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Survey Info */}
        <Card className="p-8 mb-6">
          <h1 className="text-3xl text-gray-900 mb-3">{survey.title}</h1>
          <p className="text-gray-600 mb-4">{survey.description}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((Object.keys(answers).length) / survey.questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Progress: {Object.keys(answers).length} of {survey.questions.length} questions answered
          </p>
        </Card>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {survey.questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <label className="block text-lg text-gray-900 mb-4">
                {index + 1}. {question.text}
                {question.required && <span className="text-red-600 ml-1">*</span>}
              </label>

              {question.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.id]: e.target.value })
                        }
                        className="w-4 h-4 text-[#4F46E5] focus:ring-[#4F46E5]"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answers[question.id] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [question.id]: e.target.value })
                  }
                  rows={4}
                />
              )}
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" size="lg" className="min-w-[200px]">
              Submit Survey
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
