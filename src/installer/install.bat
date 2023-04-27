@echo off

where git >nul 2>&1
if %errorlevel% neq 0 (
  echo Error: Git is not installed. Please install Git and try again.
  exit /b 1
)

cd %appdata%

git clone https://github.com/lucasammer/mobileControll.git

cd mobileControll\src\srv
npm install

schtasks /create /tn "mobilecontroll" /tr "%appdata%\mobilecontroll\src\srv\run.bat" /sc onevent /ec Microsoft-Windows-NetworkProfile/Operational /mo *[System[(EventID=10000)]]

start run