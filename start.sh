#!/bin/bash

# Script para automatizar el arranque de Diario de Escritura

echo "🚀 Iniciando Diario de Escritura..."

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID
    exit
}

trap cleanup INT TERM

# Iniciar backend
echo "📂 Iniciando servidor backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Iniciar frontend
echo "📂 Iniciando servidor frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Esperar a que los servidores estén listos
echo "⏳ Esperando a que los servidores arranquen..."
sleep 8

# Abrir el navegador
echo "🌐 Abriendo la aplicación en el navegador..."
if command -v start &> /dev/null; then
    # Windows (Git Bash)
    start http://localhost:4321
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:4321
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:4321
else
    echo "⚠️  No se pudo abrir el navegador automáticamente. Visita http://localhost:4321"
fi

echo "✅ Todo listo. Presiona Ctrl+C para detener los servidores."

# Mantener el script en ejecución
wait $BACKEND_PID $FRONTEND_PID
