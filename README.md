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

## Deployment to Supabase

This project supports **Supabase** for both the PostgreSQL database and cloud storage for resumes.

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of [schema.sql](file:///d:/Nim%20Tech%20Web/placement-registration/schema.sql).
3. Copy the **Connection String** (Transaction mode recommended) from Project Settings -> Database.

### 2. Storage Setup
1. Go to **Storage** and create a new bucket named `resumes`.
2. Set the bucket to **Public** (optional, for direct resume viewing via link) or configure appropriate policies.

### 3. Environment Variables
Update your `.env` or deployment dashboard (Render/Vercel) with:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string.
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_ANON_KEY`: Your Supabase API Key (Anon).
- `EMAIL_USER`: Your Gmail address.
- `EMAIL_PASS`: Your Gmail App Password.
- `ADMIN_PASSWORD`: Secure password for the admin dashboard.

The application will automatically use Supabase Storage for resume uploads if these variables are provided.
