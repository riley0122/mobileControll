@echo off

REM Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
  echo Error: Git is not installed. Please install Git and try again.
  exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
  echo Error: npm is not installed. Please install npm and try again.
  exit /b 1
)

REM Download the repository
git clone https://github.com/lucasammer/mobileControll.git

REM Install dependencies in the src/srv folder
cd mobileControll\src\srv
npm install

REM Create a service file
set "USER=%USERNAME%"
set "WORKING_DIR=%cd%"
set "EXEC_START=%cd%\run.bat"
(
  echo [Unit]
  echo Description=Mobile Control service
  echo After=network.target
  echo.
  echo [Service]
  echo User=%USER%
  echo WorkingDirectory=%WORKING_DIR%
  echo ExecStart=%EXEC_START%
  echo.
  echo [Install]
  echo WantedBy=multi-user.target
) > mobile-control.service

REM Install the service using sc command
sc create mobile-control binpath= "C:\Windows\System32\cmd.exe /c start /b %cd%\run.bat" start= auto

REM Start the service
sc start mobile-control
