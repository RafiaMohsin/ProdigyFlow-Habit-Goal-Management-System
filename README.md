# ProdigyFlow-Habit-Goal-Management-System
ProdigyFlow is a smart productivity and habit management system backend built with Node.js, Express, and SQL Server. It provides APIs for managing users, habits, goals, and tracking discipline through data-driven insights.
## Features
- **Node.js & Express:** Scalable and fast server setup.
- **SQL Server (mssql):** Robust relational database backend.
- **MVC Architecture:** Clean separation of concerns with Routes, Controllers, and Models.
- **RESTful APIs:** CRUD endpoints for managing Users, Categories, and Habits.

## Project Structure
- `Backend/server.js`: The main entry point of the server.
- `Backend/config/db.js`: Database connection configuration.
- `Backend/controllers/`: Application logic for handling requests.
- `Backend/models/`: Database interactions.
- `Backend/routes/`: API endpoint definitions.
- `DataBase/schema.sql`: SQL script to initialize the required tables.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) running locally or remotely

### Installation & Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Create a `.env` file inside the `Backend` directory (you can use `.env.example` as a template).
   - Ensure the database connection variables are configured correctly (e.g., `DB_USER`, `DB_PASSWORD`, `DB_SERVER=localhost`, `DB_DATABASE`).

4. **Initialize Database:**
   - Run the SQL queries provided in `DataBase/schema.sql` in your SQL Server instance to create the underlying tables.

5. **Start the server:**
   ```bash
   npm run dev
   ```
   The backend should now be running and connected to your database!
