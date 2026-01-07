import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useApp } from '../AppContext';
import { Eye, BarChart3, Share2, Trash2, Copy, QrCode, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateQRCode } from '../../utils/qrcode';
import { SurveyPreview } from '../components/SurveyPreview';

export function MySurveysPage() {
  const navigate = useNavigate();
  const { surveys, deleteSurvey, toggleSurveyStatus, fetchSurveys } = useApp();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  const selectedSurveyData = surveys.find(s => s.id === selectedSurvey);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleDelete = () => {
    if (selectedSurvey) {
      deleteSurvey(selectedSurvey);
      setDeleteModalOpen(false);
      setSelectedSurvey(null);
      toast.success('Survey deleted successfully');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/survey/${selectedSurvey}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
    setShareModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">My Surveys</h1>
          <p className="text-gray-600">
            Manage and view all your surveys
          </p>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg text-gray-900 flex-1 pr-2">
                    {survey.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs shrink-0 ${
                      survey.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {survey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {survey.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span>{survey.createdAt}</span>
                  <span>•</span>
                  <span>{survey.responseCount} responses</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(survey.id);
                    setPreviewOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Preview</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/analytics/${survey.id}`, { state: { from: 'surveys' } })}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Analytics</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(survey.id);
                    setShareModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>

              {/* Delete Button */}
              <div className="flex gap-2">
                <Button
                  variant={survey.isActive ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => toggleSurveyStatus(survey.id)}
                  className="flex-1"
                >
                  {survey.isActive ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Close Survey
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Open Survey
                    </>
                  )}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(survey.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Survey"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          }
        >
          <p className="text-gray-600">
            Are you sure you want to delete this survey? This action cannot be undone.
          </p>
        </Modal>

        {/* Share Modal */}
        <Modal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Survey"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShareModalOpen(false)}>
                Close
              </Button>
              <Button onClick={handleShare}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={() => {
                setQrModalOpen(true);
                setShareModalOpen(false);
              }}>
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Share this link with your participants:
            </p>
            <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700 break-all">
              {window.location.origin}/survey/{selectedSurvey}
            </div>
          </div>
        </Modal>

        {/* QR Code Modal */}
        <Modal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          title="QR Code"
          footer={
            <Button onClick={() => setQrModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Scan this QR code to access the survey:
            </p>
            {selectedSurvey && (
              <div className="flex justify-center">
                <img 
                  src={generateQRCode(`${window.location.origin}/survey/${selectedSurvey}`)}
                  alt="Survey QR Code"
                  className="border border-gray-200 rounded-lg"
                />
              </div>
            )}
            <p className="text-sm text-gray-500">
              {selectedSurveyData?.title}
            </p>
          </div>
        </Modal>

        {/* Survey Preview */}
        {selectedSurveyData && (
          <SurveyPreview
            survey={selectedSurveyData}
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}
