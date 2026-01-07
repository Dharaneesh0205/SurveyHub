import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../AppContext';
import { BarChart3, Eye, Users } from 'lucide-react';

export function AnalyticsListPage() {
  const navigate = useNavigate();
  const { surveys, fetchSurveys } = useApp();

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">
            View detailed analytics and insights for all your surveys
          </p>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    survey.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {survey.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {survey.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {survey.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{survey.responseCount}</span>
                  <span>responses</span>
                </div>
                <span>•</span>
                <span>{survey.createdAt}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/analytics/${survey.id}`, { state: { from: 'analytics' } })}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/survey/${survey.id}`)}
                  size="sm"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {surveys.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-6">Create your first survey to start collecting responses and viewing analytics.</p>
            <Button onClick={() => navigate('/create')}>
              Create Survey
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}