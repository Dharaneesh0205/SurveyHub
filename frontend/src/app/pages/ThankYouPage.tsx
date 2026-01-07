import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle } from 'lucide-react';

export function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#22C55E] p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </div>

        <h1 className="text-3xl text-gray-900 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">
          Your response has been submitted successfully. We appreciate you taking the time to
          complete this survey.
        </p>

        <Button onClick={() => navigate('/login')} size="lg">
          Back to Home
        </Button>
      </Card>
    </div>
  );
}
