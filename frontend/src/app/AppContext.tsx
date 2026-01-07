import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Survey, Response } from './types';
import apiService from '../services/api';
import { toast } from 'sonner';

interface AppContextType {
  user: User | null;
  surveys: Survey[];
  responses: Response[];
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'responseCount'>) => Promise<void>;
  updateSurvey: (id: string, survey: Partial<Survey>) => Promise<void>;
  deleteSurvey: (id: string) => Promise<void>;
  toggleSurveyStatus: (id: string) => Promise<void>;
  addResponse: (surveyId: string, answers: any[]) => Promise<void>;
  fetchSurveys: () => Promise<void>;
  getSurveyResults: (surveyId: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);



export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
        fetchSurveys();
      }
    }
    setInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await apiService.login(email, password);
      const user = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      };
      setUser(user);
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      await fetchSurveys();
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await apiService.register(name, email, password);
      const user = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      };
      setUser(user);
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('userData');
    setUser(null);
    setSurveys([]);
    setResponses([]);
    toast.success('Logged out successfully');
  };

  const fetchSurveys = async () => {
    try {
      const surveysData = await apiService.getSurveys();
      setSurveys(surveysData.map((survey: any) => ({
        id: survey._id,
        title: survey.title,
        description: survey.description,
        questions: survey.questions.map((q: any) => ({
          id: q._id,
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required
        })),
        createdAt: new Date(survey.createdAt).toISOString().split('T')[0],
        responseCount: survey.responseCount,
        isActive: survey.isActive
      })));
    } catch (error: any) {
      toast.error('Failed to fetch surveys');
    }
  };

  const addSurvey = async (survey: Omit<Survey, 'id' | 'createdAt' | 'responseCount'>) => {
    try {
      setLoading(true);
      const newSurvey = await apiService.createSurvey(survey);
      await fetchSurveys();
      toast.success('Survey created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create survey');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSurvey = async (id: string, updatedSurvey: Partial<Survey>) => {
    try {
      setLoading(true);
      await apiService.updateSurvey(id, updatedSurvey);
      await fetchSurveys();
      toast.success('Survey updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update survey');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteSurvey(id);
      await fetchSurveys();
      toast.success('Survey deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete survey');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleSurveyStatus = async (id: string) => {
    try {
      setLoading(true);
      await apiService.toggleSurveyStatus(id);
      await fetchSurveys();
      toast.success('Survey status updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update survey status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addResponse = async (surveyId: string, answers: any[]) => {
    try {
      setLoading(true);
      await apiService.submitResponse(surveyId, answers);
      await fetchSurveys(); // Refresh to update response count
      toast.success('Response submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit response');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSurveyResults = async (surveyId: string) => {
    try {
      return await apiService.getSurveyResults(surveyId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch survey results');
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        surveys,
        responses,
        loading,
        initializing,
        login,
        register,
        logout,
        addSurvey,
        updateSurvey,
        deleteSurvey,
        toggleSurveyStatus,
        addResponse,
        fetchSurveys,
        getSurveyResults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}