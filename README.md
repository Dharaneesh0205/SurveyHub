<<<<<<< HEAD
# 📊 SurveyHub - Survey & Feedback Web App

A full-stack survey application built with React, Node.js, Express, and MongoDB. Users can create surveys, collect responses, and view analytics with interactive charts.

## 🚀 Features

- **Authentication**: JWT-based user registration and login
- **Survey Creation**: Create surveys with multiple choice and text questions
- **Response Collection**: Public survey links for response collection
- **Analytics Dashboard**: View results with interactive charts
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- Radix UI components

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## 📁 Project Structure

```
SurveyHub/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── types.ts
│   │   └── services/
│   └── package.json
├── server/            # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

## 🚀 Deployment

### Quick Deploy
1. **Backend**: Deploy to [Render](https://render.com) - See [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Frontend**: Deploy to [Vercel](https://vercel.com) - See [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Database**: MongoDB Atlas (already cloud-ready)

### Live Demo
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔧 Local Development

## 🔧 Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd SurveyHub
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/surveyhub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=5000
NODE_ENV=development
```

**MongoDB Atlas Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Create database user
4. Get connection string
5. Replace `MONGODB_URI` in `.env`

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Surveys
- `GET /api/surveys` - Get user's surveys (protected)
- `POST /api/surveys` - Create survey (protected)
- `GET /api/surveys/:id` - Get survey by ID
- `PUT /api/surveys/:id` - Update survey (protected)
- `DELETE /api/surveys/:id` - Delete survey (protected)

### Responses
- `POST /api/responses` - Submit survey response
- `GET /api/responses/results/:surveyId` - Get survey analytics (protected)

## 🎯 Usage

1. **Register/Login**: Create account or login
2. **Create Survey**: Add title, description, and questions
3. **Share Survey**: Copy survey link to collect responses
4. **View Analytics**: Check dashboard for response analytics
5. **Manage Surveys**: Edit, delete, or toggle survey status

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Deploy automatically

### Backend (Render)
1. Create account on Render
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
NODE_ENV=production
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## 🎨 UI Components

- Custom components with Tailwind CSS
- Radix UI for accessible components
- Responsive design
- Interactive charts with Recharts
- Toast notifications

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Survey
```javascript
{
  title: String,
  description: String,
  questions: [Question],
  createdBy: ObjectId (User),
  isActive: Boolean,
  responseCount: Number,
  timestamps: true
}
```

### Response
```javascript
{
  surveyId: ObjectId (Survey),
  answers: [Answer],
  timestamps: true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI in `.env`
   - Ensure IP is whitelisted in Atlas
   - Verify database user credentials

2. **CORS Error**
   - Backend running on port 5000
   - Frontend running on port 5173
   - Check API_BASE_URL in frontend

3. **JWT Token Issues**
   - Clear localStorage
   - Check JWT_SECRET in backend
   - Verify token expiration

### Support
Create an issue on GitHub for support.

---

Built with ❤️ for survey and feedback collection
=======
# SurveyHub
>>>>>>> 8a14f06acdda3337dd7503b0aa2fce73906e667e
