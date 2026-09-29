@echo off
setlocal
cd /d "%~dp0"
title PACDesk - Demo Consultas de Ingenieria PAC
color 0B

echo ======================================================================
echo   PACDesk - Portal de Consultas Tecnicas de Ingenieria PAC
echo   (Protecciones, Automatizacion, Control y Comunicaciones)
echo ======================================================================
echo.
echo [1/2] Verificando entorno de ejecucion...

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [2/2] Lanzando servidor local con Python...
    echo.
    py server.py
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [2/2] Lanzando servidor local con Python...
    echo.
    python server.py
    goto end
)

echo.
echo [AVISO] Python no fue detectado en PATH.
echo [2/2] Abriendo index.html directamente en tu navegador predeterminado...
echo.
start "" "index.html"

:end
echo.
pause
