@echo off
echo 🚀 Setting up SurveyHub...
echo.

echo 📦 Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)

echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Set up MongoDB Atlas account
echo 2. Update server/.env with your MongoDB URI
echo 3. Run 'npm run dev' in server folder
echo 4. Run 'npm run dev' in frontend folder
echo.
echo 🌐 Frontend will be at: http://localhost:5173
echo 🔧 Backend will be at: http://localhost:5000
echo.
pause