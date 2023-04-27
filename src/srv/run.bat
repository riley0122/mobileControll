@echo off
setlocal

REM temporary solution, gonna make it in c#

cd %appdata%/mobileControll/src/srv

where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo Node.js is installed
  npm install
  cd %appdata%/mobileControll/src/srv
  :loop
    npm start
    GOTO loop
  GOTO loop
) else (
  echo Node.js is not installed!
  pause
  exit /b 1
)

endlocal