@echo off
title AgentFlow — Upload to GitHub

echo.
echo  ====================================================
echo   AgentFlow - Upload to GitHub
echo  ====================================================
echo.

echo  [1/5] Cleaning unnecessary files...
if exist ".next" rmdir /s /q ".next"
if exist ".vercel" rmdir /s /q ".vercel"
echo  Cleaned.
echo.

echo  [2/5] Setting up Git...
if not exist ".git" (
    git init
    echo  New repo created.
) else (
    echo  Repo already exists.
)
git config user.email "moreda0088@gmail.com"
git config user.name "moreda0088"
echo  Git config set.
echo.

echo  [3/5] Adding all files...
git add -A
echo  Files staged.
echo.

echo  [4/5] Committing...
git commit -m "AgentFlow - Agentic Economy on Arc Hackathon"
echo.

echo  [5/5] Pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/moreda0088/agent.git
git branch -M main
git push -u origin main -f

echo.
echo  ====================================================
echo   DONE! Your code is live at:
echo   https://github.com/moreda0088/agent
echo.
echo   Next: Run build.bat to deploy to Vercel.
echo  ====================================================
echo.
pause
