# SurveyHub

SurveyHub is a full-stack survey and feedback web application built with React (frontend) and Node.js/Express (backend) with MongoDB for persistence. Users can create surveys, collect responses via public links, and view analytics with interactive charts.

Live Demo

- Hosted app: [https://survey-hub-chi.vercel.app/login](https://survey-hub-chi.vercel.app/)

Features

- User authentication (JWT)
- Create surveys with multiple choice and text questions
- Share public survey links to collect responses
- Analytics dashboard with charts
- Responsive UI built with Tailwind CSS and Radix UI

Tech Stack

Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Radix UI

Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- bcryptjs
- CORS

Repository Structure

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

Prerequisites

- Node.js 18+ (or latest LTS)
- npm (or yarn)
- MongoDB Atlas account (or local MongoDB)
- Git

Local Development

1. Clone the repository

```bash
git clone https://github.com/Dharaneesh0205/SurveyHub.git
cd SurveyHub
```

2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory with the following values (example):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/surveyhub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

Start the backend (development):

```bash
npm run dev
```

Common backend scripts (in `server/package.json`)
- `start` - start production server
- `dev` - start development server with nodemon (if configured)

3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend typically runs on http://localhost:5173 (Vite default). If the frontend expects an API base URL, update the environment variable or config (e.g. `VITE_API_BASE_URL` or similar) to point to `http://localhost:5000`.

Environment variables for production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
NODE_ENV=production
```

Deployment

- Frontend: Deploy to Vercel. Connect the GitHub repository and set environment variables (if required).
- Backend: Deploy to Render, Heroku, or any Node.js host. Configure environment variables and allow incoming connections from your frontend domain.

Notes

- Ensure CORS settings on the backend allow the frontend origin (local or deployed).
- If using MongoDB Atlas, whitelist your server IP(s) or set access to allow your deployment platform.

API Endpoints (examples)

Authentication
- POST /api/auth/register
- POST /api/auth/login

Surveys
- GET /api/surveys
- POST /api/surveys
- GET /api/surveys/:id
- PUT /api/surveys/:id
- DELETE /api/surveys/:id

Responses
- POST /api/responses
- GET /api/responses/results/:surveyId

Troubleshooting

- MongoDB connection errors: verify MONGODB_URI and Atlas network access
- CORS issues: ensure backend CORS is configured and frontend uses correct API URL
- JWT token issues: clear browser localStorage and ensure JWT_SECRET matches between deployments

Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes and push
4. Open a Pull Request

License

This project is open-source under the MIT License.

Contact

If you need help, open an issue on the repository.
