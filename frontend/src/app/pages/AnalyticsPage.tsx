import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../AppContext';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import socketService from '../../services/socket';
import { exportToCSV, exportAnalyticsToPDF } from '../../utils/export';

export function AnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getSurveyResults } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Smart back navigation
  const handleBackNavigation = () => {
    const state = location.state as { from?: string } | null;
    if (state?.from === 'surveys') {
      navigate('/surveys');
    } else {
      navigate('/analytics');
    }
  };

  // Export functions
  const exportToPDF = () => {
    if (!analytics) return;
    exportAnalyticsToPDF('Survey Analytics', analytics);
    toast.success('PDF export initiated!');
  };

  const exportCSV = () => {
    if (!analytics || !analytics.questions) return;
    const csvData = analytics.questions.flatMap((q: any, qIndex: number) => {
      if (q.type === 'multiple-choice') {
        return Object.entries(q.data || {}).map(([option, count]) => ({
          Question: `Q${qIndex + 1}: ${q.questionText}`,
          Option: option,
          Responses: count
        }));
      } else {
        return (q.data || []).map((answer: string, aIndex: number) => ({
          Question: `Q${qIndex + 1}: ${q.questionText}`,
          Response: answer,
          Index: aIndex + 1
        }));
      }
    });
    exportToCSV(csvData, 'survey-analytics');
    toast.success('CSV exported successfully!');
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (id) {
          const data = await getSurveyResults(id);
          setAnalytics(data);
          
          // Connect to socket and join survey room for real-time updates
          socketService.connect();
          socketService.joinSurvey(id);
          
          // Listen for new responses
          socketService.onNewResponse((data) => {
            if (data.surveyId === id) {
              toast.success('New response received!');
              // Refresh analytics data
              fetchAnalytics();
            }
          });
        }
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    
    // Cleanup on unmount
    return () => {
      socketService.offNewResponse();
    };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl text-gray-900 mb-4">Survey Not Found</h1>
          <Button onClick={() => navigate('/surveys')}>Back to Surveys</Button>
        </div>
      </Layout>
    );
  }

  const COLORS = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackNavigation} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl text-gray-900 mb-1">Survey Analytics</h1>
            <p className="text-gray-600">
              Total Responses: {analytics.totalResponses}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCSV} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="secondary" onClick={exportToPDF} size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Questions Analytics */}
        <div className="space-y-8">
          {analytics.questions && analytics.questions.length > 0 ? (
            analytics.questions.map((question: any, index: number) => {
              return (
                <Card key={question.questionId || index} className="p-6">
                  <h3 className="text-lg text-gray-900 mb-6">
                    Q{index + 1}: {question.questionText || 'Untitled Question'}
                  </h3>

                  {question.type === 'multiple-choice' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {question.data && Object.keys(question.data).length > 0 ? (
                        <>
                          {/* Pie Chart */}
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={Object.entries(question.data).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {Object.entries(question.data).map((entry, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={COLORS[idx % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]} />
                                <Legend 
                                  verticalAlign="bottom" 
                                  height={36}
                                  formatter={(value, entry) => `${value} (${entry.payload.value})`}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Bar Chart */}
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={Object.entries(question.data).map(([name, value]) => ({ name, value }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="name" 
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                  interval={0}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4F46E5" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2">
                          <p className="text-gray-500 text-center py-8">
                            No responses yet
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {question.data && question.data.length > 0 ? (
                        question.data.map((answer: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="text-gray-700">{answer}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No responses yet
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No survey data available</p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}