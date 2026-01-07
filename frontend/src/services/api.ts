const API_BASE_URL = 'https://surveyhub-backend.onrender.com/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  // Auth APIs
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Survey APIs
  async createSurvey(surveyData: any) {
    const response = await fetch(`${API_BASE_URL}/surveys`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(surveyData)
    });
    return this.handleResponse(response);
  }

  async getSurveys() {
    const response = await fetch(`${API_BASE_URL}/surveys`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getSurvey(id: string) {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateSurvey(id: string, surveyData: any) {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(surveyData)
    });
    return this.handleResponse(response);
  }

  async deleteSurvey(id: string) {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async toggleSurveyStatus(id: string) {
    const response = await fetch(`${API_BASE_URL}/surveys/${id}/toggle-status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Response APIs
  async submitResponse(surveyId: string, answers: any[]) {
    const response = await fetch(`${API_BASE_URL}/responses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ surveyId, answers })
    });
    return this.handleResponse(response);
  }

  async getSurveyResults(surveyId: string) {
    const response = await fetch(`${API_BASE_URL}/responses/results/${surveyId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();