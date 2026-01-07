import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Survey } from '../types';
import { Eye, X } from 'lucide-react';

interface SurveyPreviewProps {
  survey: Survey;
  isOpen: boolean;
  onClose: () => void;
}

export function SurveyPreview({ survey, isOpen, onClose }: SurveyPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Survey Preview</h2>
          </div>
          <Button variant="ghost" onClick={onClose} size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Survey Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{survey.title}</h1>
            <p className="text-gray-600">{survey.description}</p>
          </div>

          {/* Questions Preview */}
          <div className="space-y-4">
            {survey.questions.map((question, index) => (
              <Card key={question.id} className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>

                {question.type === 'multiple-choice' ? (
                  <div className="space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-500 italic">Text answer field</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </div>
      </div>
    </div>
  );
}