# Simple Notes App
This project is a full-stack webb app for creating, managing and organizing notes.
The application is a Single Page Application (SPA) with a RESTful API backend and a React frontend.

✨ Main Features

🔐 Secure authentication with JWT.

👤 Each note is linked to the user who created it.

🗂️ Notes management: create, edit, delete, and archive.

🏷️ Tag filtering and note search.

📄 Pagination for a smoother experience.

📅 Automatic CreatedAt and UpdatedAt fields in notes.

🎨 Frontend built with React + TailwindCSS, backend with ASP.NET Core Web API.

🛠️ Technologies Used

Backend: ASP.NET Core, Entity Framework Core, SQL Server

Frontend: React, Vite, TailwindCSS

Authentication: JSON Web Tokens (JWT)

ORM: EF Core with migrations

Database: SQL Server Express / LocalDB

### 1. Requirements
The application requires the following tools and runtimes:

* **Node.js**: v22.19.0 or later
* [Download Node.js](https://nodejs.org/en/download)
* **npm**: v10.9.3 or later
* **.NET SDK**: 9.0.302 or later
    * [Download .NET SDK](https://dotnet.microsoft.com/es-es/download/dotnet/9.0)
* **SQL Server**: Any version with an accessible instance
    * [Download SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
Optional: SQL Server Management Studio (SSMS) (to run the DataBase)
* [Download SSMS](https://learn.microsoft.com/en-us/ssms/install/install)

### 2. Project Structure
The project is structured into two main directories:

* **`backend/`**: Contains the C# .NET Web API.
* **`frontend/`**: Contains the React + TypeScript frontend application.

### 3. Setup and Running the Application

#### IMPORTANT: Make sure to change the "DefaultConnection" in `backend/appsettings.json` with your current SQL Server route.

To set up and run the application, you can use the provided `run.sh` script or follow the manual steps below.

#### IMPORTANT: Run the SQL Server before start.

#### Using the `run.sh` Script (Recommended)
1.  Make sure you have all the required runtimes installed.
2.  Open a terminal in the project's root directory.
3.  Execute the script:
    ```bash
    ./run.sh
    ```
    This script will automatically:
    * Restore backend dependencies.
    * Create and migrate the SQL Server database.
    * Start the backend and frontend in development mode.

#### Manual Setup

**Backend (C# .NET Web API)**
1.  Open the `backend/` directory in a terminal.
2.  **Database Configuration**: Open `appsettings.json` and update the `ConnectionStrings` to point to your SQL Server instance.

3.  **Database Migration**: Run the following commands to apply the database schema.
    ```bash
    dotnet ef database update
    ```
4.  **Run the Backend**:
    ```bash
    dotnet watch run --launch-profile https
    ```
    The backend API will run on `https://localhost:7074`.

**Frontend (React + TypeScript)**

1.  Open the `frontend/` directory in a new terminal.
2.  **Environment Variable**: Create a file named `.env` in the `frontend` folder and add the API URL.
    ```env
    VITE_API_URL=https://localhost:7074/api/notes
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run the Frontend**:
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

---

### 4. Default Credentials

The application includes a pre-configured user for demonstration purposes:

* **Username**: `admin`
* **Password**: `123456`
