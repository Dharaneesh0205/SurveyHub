import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('https://surveyhub-backend.onrender.com');
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSurvey(surveyId: string) {
    if (this.socket) {
      this.socket.emit('join-survey', surveyId);
    }
  }

  onNewResponse(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new-response', callback);
    }
  }

  offNewResponse() {
    if (this.socket) {
      this.socket.off('new-response');
    }
  }
}

export default new SocketService();