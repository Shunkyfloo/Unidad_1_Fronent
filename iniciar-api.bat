@echo off
chcp 65001 >nul
cd /d "%~dp0backend"
if not exist "node_modules\" (
  echo Instalando dependencias del backend...
  call npm install
  if errorlevel 1 exit /b 1
)
echo Iniciando API en http://localhost:3000
call npm run dev
