import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../AppContext';
import { ClipboardList, MessageSquare, CheckCircle, Plus } from 'lucide-react';
import socketService from '../../services/socket';

export function DashboardPage() {
  const navigate = useNavigate();
  const { surveys, fetchSurveys } = useApp();

  useEffect(() => {
    fetchSurveys();
    
    // Connect to socket for real-time updates
    socketService.connect();
    
    // Listen for new responses across all surveys
    socketService.onNewResponse(() => {
      fetchSurveys(); // Refresh survey data when new responses come in
    });
    
    return () => {
      socketService.offNewResponse();
    };
  }, []);

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((sum, survey) => sum + survey.responseCount, 0);
  const activeSurveys = surveys.filter((s) => s.isActive).length;

  const stats = [
    {
      label: 'Total Surveys',
      value: totalSurveys,
      icon: ClipboardList,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Responses',
      value: totalResponses,
      icon: MessageSquare,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Active Surveys',
      value: activeSurveys,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your surveys.</p>
          </div>
          <Button
            onClick={() => navigate('/create')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Survey
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                    <Icon className={`w-8 h-8 ${stat.textColor}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Surveys */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Surveys</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/surveys')}
              className="text-blue-600 hover:text-blue-700 w-full sm:w-auto justify-center"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {surveys.slice(0, 3).map((survey) => (
              <Card key={survey.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{survey.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{survey.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>Created: {survey.createdAt}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-medium">{survey.responseCount} responses</span>
                      <span className="hidden sm:inline">•</span>
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
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/analytics/${survey.id}`, { state: { from: 'surveys' } })}
                    className="md:ml-4 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 hover:from-blue-100 hover:to-purple-100 border-0 w-full md:w-auto justify-center"
                  >
                    View Analytics
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
