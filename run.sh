#!/bin/bash

# --- Frontend Setup (React) ---
echo "--- Setting up frontend ---"
cd frontend
echo "Installing frontend dependencies..."
npm install

# --- Backend Setup (.NET) ---
echo "--- Setting up backend ---"
cd ../backend

echo "Restoring backend dependencies..."
dotnet restore

echo "Applying database migrations..."
dotnet ef database update
# --- Check for migration success ---
if [ $? -ne 0 ]; then
    echo "Error: Database migration failed. Please check your SQL Server connection string and ensure the server is running."
    exit 1
fi

# --- Run Both Applications ---
echo "--- Starting both frontend and backend ---"

# Start the backend in the background and log its output
echo "Starting backend with 'dotnet watch run --launch-profile https'..."
dotnet watch run --launch-profile https > backend_log.txt 2>&1 &

# Store the backend process ID
BACKEND_PID=$!

# Wait for a few seconds to ensure the backend is running
sleep 5

# Start the frontend in the foreground
echo "Starting frontend with 'npm run dev'..."
cd ../frontend
npm run dev

# This section ensures that if the user exits the script (e.g., with Ctrl+C),
# the background process is also terminated.
trap "echo 'Stopping backend...'; kill $BACKEND_PID; echo 'Cleanup complete.'; exit" INT
wait $BACKEND_PID