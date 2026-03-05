-- Database Schema for Placement Drive Registration System

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    registration_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    current_city VARCHAR(100) NOT NULL,
    current_state VARCHAR(100) NOT NULL,
    willing_to_relocate BOOLEAN NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    degree VARCHAR(50) NOT NULL,
    yop INTEGER NOT NULL,
    current_cgpa DECIMAL(4,2) NOT NULL,
    tenth_percent DECIMAL(5,2) NOT NULL,
    twelfth_percent DECIMAL(5,2) NOT NULL,
    ug_cgpa DECIMAL(4,2) NOT NULL,
    current_arrears BOOLEAN NOT NULL,
    history_arrears INTEGER DEFAULT 0,
    arrears_status VARCHAR(20),
    project_title VARCHAR(200) NOT NULL,
    project_description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    internship_experience BOOLEAN NOT NULL,
    internship_details JSONB, -- {company, role, duration}
    preferred_role VARCHAR(100) NOT NULL,
    preferred_location VARCHAR(100) NOT NULL,
    expected_salary VARCHAR(50),
    resume_path TEXT NOT NULL,
    availability VARCHAR(50) NOT NULL,
    declaration_accepted BOOLEAN NOT NULL,
    linkedin_profile VARCHAR(200),
    github_profile VARCHAR(200),
    portfolio_website VARCHAR(200),
    primary_skills TEXT,
    tools_technologies TEXT,
    certifications TEXT,
    skill_level VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_department ON registrations(department);
CREATE INDEX idx_cgpa ON registrations(current_cgpa);
CREATE INDEX idx_registration_id ON registrations(registration_id);
