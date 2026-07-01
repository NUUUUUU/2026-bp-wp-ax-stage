@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 무대 슬라이드 서버 (닫으면 서버 꺼짐)
echo.
echo   ========================================================
echo    2026 경진대회 무대 슬라이드 - 로컬 서버
echo   ========================================================
echo.
echo   잠시 후 아래 주소를 크롬 주소창에 붙여넣어 여세요:
echo.
echo     운영 콘솔   :  http://localhost:3000/admin.html
echo     시상 발표   :  http://localhost:3000/awards.html
echo     심사위원안내 :  http://localhost:3000/guidance.html
echo.
echo   * 이 검은 창을 닫으면 서버가 꺼집니다. 행사 동안 열어두세요.
echo.
node "%~dp0_server.cjs"
echo.
echo   [서버가 종료되었습니다. node 설치 여부를 확인하세요.]
pause
