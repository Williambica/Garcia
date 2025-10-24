@echo off
echo ========================================
echo  COMANDOS PARA SUBIR PROJETO NO GITHUB
echo ========================================
echo.

echo 1. Inicializando repositorio Git...
git init

echo.
echo 2. Adicionando todos os arquivos...
git add .

echo.
echo 3. Fazendo commit inicial...
git commit -m "feat: implementacao inicial do Chat GarcIA - Casal Garcia Imoveis"

echo.
echo 4. Adicionando repositorio remoto...
git remote add origin https://github.com/Williambica/ChatbotGarcia.git

echo.
echo 5. Renomeando branch para main...
git branch -M main

echo.
echo 6. Fazendo push para o GitHub...
git push -u origin main

echo.
echo ========================================
echo  PROJETO ENVIADO PARA O GITHUB!
echo ========================================
echo.
echo URL do repositorio: https://github.com/Williambica/ChatbotGarcia
echo.
pause