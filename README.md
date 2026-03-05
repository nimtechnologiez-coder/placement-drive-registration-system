# Placement Drive Registration System

A production-ready student registration system with a modern multi-step form and an admin dashboard for management.

## Features
- **Multi-step Registration Form**: Smooth UI with progress indicators.
- **Secure File Upload**: Resume uploads restricted to PDF/DOC with 5MB limit.
- **Admin Dashboard**: Search, filter by department/CGPA/YOP, and view student profiles.
- **Excel Export**: Export all registered student data to XLSX.
- **Email Confirmation**: Automatic notification to students upon successful registration.
- **Unique ID Generation**: Automatically generates IDs like `PD-0001`.

## Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JS.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL.
- **Services**: Multer (File Upload), Nodemailer (Email), XLSX (Excel Export).

## Setup Instructions

### 1. Database Setup
1. Install PostgreSQL and create a database named `placement_db`.
2. Run the provided `schema.sql` to create the `registrations` table.

### 2. Backend Configuration
1. Rename `.env.example` to `.env`.
2. Update the database credentials (`DB_USER`, `DB_PASSWORD`, etc.).
3. Configure `EMAIL_USER` and `EMAIL_PASS` (using Gmail App Passwords if applicable).

### 3. Installation
```bash
# Install dependencies
npm install

# Start the server
npm start
```

### 4. Access the Application
- **Registration Form**: `http://localhost:5000`
- **Admin Dashboard**: `http://localhost:5000/admin`

## Deployment to Render

This project is configured for easy deployment via **Render Blueprints**.

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Render Dashboard**: Go to [Render Dashboard](https://dashboard.render.com).
3.  **Blueprints**: Click "New" -> "Blueprint".
4.  **Connect Repo**: Select your GitHub repository.
5.  **Configure**: Render will automatically detect `render.yaml`.
6.  **Environment Variables**:
    - `EMAIL_USER`: Your Gmail address.
    - `EMAIL_PASS`: Your Gmail App Password.
    - `ADMIN_PASSWORD`: A secure password for the admin dashboard.

The database and persistent storage for resumes will be automatically created.
