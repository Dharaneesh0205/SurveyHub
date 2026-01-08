import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { useApp } from '../AppContext';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Survey, Question } from '../types';
import { toast } from 'sonner';
import { surveyTemplates } from '../../data/templates';

export function CreateSurveyPage() {
  const navigate = useNavigate();
  const { addSurvey } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: '',
      type: 'multiple-choice',
      options: ['', ''],
      required: true,
    },
  ]);

  const useTemplate = (template: any) => {
    setTitle(template.name);
    setDescription(template.description);
    setQuestions(template.questions.map((q: any, index: number) => ({
      id: (index + 1).toString(),
      ...q
    })));
    setShowTemplates(false);
    toast.success('Template applied successfully!');
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: '',
        type: 'multiple-choice',
        options: ['', ''],
        required: true,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), ''] } : q
      )
    );
  };

  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options?.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const handleSave = () => {
    if (!title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSurvey: Survey = {
      id: Date.now().toString(),
      title,
      description,
      questions: questions.filter((q) => q.text),
      createdAt: new Date().toISOString().split('T')[0],
      responseCount: 0,
      isActive: true,
    };

    addSurvey(newSurvey);
    toast.success('Survey created successfully!');
    navigate('/surveys');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Create Survey</h1>
            <p className="text-gray-600">Design your survey with custom questions</p>
          </div>
          <Button 
            onClick={() => setShowTemplates(!showTemplates)} 
            variant="secondary"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-4 h-4" />
            Use Template
          </Button>
        </div>

        {/* Templates */}
        {showTemplates && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {surveyTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => useTemplate(template)}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <p className="text-xs text-blue-600 mt-2">{template.questions.length} questions</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Survey Details */}
        <Card className="p-6 space-y-5">
          <Input
            label="Survey Title"
            placeholder="Enter survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Survey Description"
            placeholder="Enter survey description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl text-gray-900">Questions</h2>
            <Button onClick={addQuestion} variant="secondary" size="sm" className="w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <Input
                    label={`Question ${qIndex + 1}`}
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, { text: e.target.value })
                    }
                  />

                  <Select
                    label="Question Type"
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        type: e.target.value as 'multiple-choice' | 'short-answer',
                      })
                    }
                    options={[
                      { value: 'multiple-choice', label: 'Multiple Choice' },
                      { value: 'short-answer', label: 'Short Answer' },
                    ]}
                  />

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      <label className="block text-sm text-gray-700">Options</label>
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(question.id, oIndex, e.target.value)
                            }
                          />
                          <button
                            onClick={() => removeOption(question.id, oIndex)}
                            className="text-red-600 hover:text-red-700 p-2 self-start sm:self-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addOption(question.id)}
                        variant="ghost"
                        size="sm"
                      >
                        + Add Option
                      </Button>
                    </div>
                  )}
                </div>

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/surveys')} className="w-full sm:w-auto justify-center">
            Cancel
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto justify-center">Save Survey</Button>
        </div>
      </div>
    </Layout>
  );
}
