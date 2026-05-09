@echo off
title AgentFlow — Deploy to Vercel

echo.
echo  ====================================================
echo   AgentFlow - Deploy to Vercel
echo  ====================================================
echo.

echo  [1/5] Installing dependencies...
call npm install --loglevel=error
echo  Done.
echo.

echo  [2/5] Installing Vercel CLI...
call npm install -g vercel --loglevel=error
echo  Done.
echo.

echo  [3/5] Cleaning old deploy data...
if exist ".vercel" rmdir /s /q ".vercel"
echo  Done.
echo.

echo  [4/5] Logging in to Vercel...
echo  A browser will open. Log in with your account.
echo.
call vercel login
echo.

echo  [5/5] Deploying to Vercel...
echo.
echo  ====================================================
echo   WHEN VERCEL ASKS YOU QUESTIONS:
echo.
echo   Set up and deploy?       Y
echo   Which scope?             (pick your account)
echo   Link to existing?        N
echo   Project name?            agentflow
echo   Directory?               ./
echo   Want to modify settings? N      (TYPE N !!!!)
echo  ====================================================
echo.

call vercel --prod

echo.
echo  ====================================================
echo   DONE!
echo.
echo   Copy the URL from above. That is your live app.
echo.
echo   NOW ADD YOUR API KEYS:
echo   1. Go to vercel.com/dashboard
echo   2. Click the agentflow project
echo   3. Go to Settings then Environment Variables
echo   4. Add these 4 variables:
echo      OPENROUTER_API_KEY    = your key
echo      CIRCLE_API_KEY        = your key
echo      DEMO_MODE             = true
echo      NEXT_PUBLIC_DEMO_MODE = true
echo   5. Go to Deployments tab and click Redeploy
echo  ====================================================
echo.
pause
