# Boltech HRMS - FastAPI Backend

This is the backend service API for the Human Resource Management System (HRMS), built using **Python (FastAPI)** and backed by a **PostgreSQL** database.

---

## 🛠️ Setup Instructions

### Prerequisites
*   Python 3.9 or higher.
*   PostgreSQL running locally or hosted on a remote server.

### 1. Initialize Virtual Environment
Navigate into the `backend/` directory and create a virtual env:

**Windows (PowerShell)**:
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS / Linux**:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Packages
Ensure your virtual environment is active, then run:
```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL Database
1.  Log in to your local PostgreSQL instance:
    ```bash
    psql -U postgres
    ```
2.  Create the database for HRMS:
    ```sql
    CREATE DATABASE boltech_hrms;
    ```
3.  Import the schema and initial seed data:
    ```bash
    psql -U postgres -d boltech_hrms -f db/init.sql
    ```

### 4. Configure Environment variables
Duplicate or edit the `.env` file to match your database port, host, username, and password credentials:
```text
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/boltech_hrms
JWT_SECRET=4f7b6bfa1e976db575dfa3d3c8c7c94519961db6e75a6104e76c1ad546d1bfcd
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
PORT=8000
```

### 5. Launch the FastAPI Development Server
Start the Uvicorn ASGI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📖 API Documentation & Sandbox
FastAPI automatically generates interactive documentation for all endpoints:

*   **Swagger UI (Interactive API Sandbox)**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Redoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

You can use the Swagger UI to authenticate, call routes, and inspect JSON payloads directly in the browser!
