const db = require('../config/db');

class Registration {
    static async generateRegistrationId() {
        const query = 'SELECT registration_id FROM registrations ORDER BY id DESC LIMIT 1';
        const { rows } = await db.query(query);

        if (rows.length === 0) {
            return 'PD-0001';
        }

        const lastId = rows[0].registration_id;
        const lastNum = parseInt(lastId.split('-')[1]);
        const nextNum = (lastNum + 1).toString().padStart(4, '0');
        return `PD-${nextNum}`;
    }

    static async create(data) {
        const registrationId = await this.generateRegistrationId();
        const query = `
      INSERT INTO registrations (
        registration_id, full_name, email, mobile, gender, dob, 
        current_city, current_state, willing_to_relocate, college_name, 
        department, degree, yop, current_cgpa, tenth_percent, 
        twelfth_percent, ug_cgpa, current_arrears, history_arrears, 
        arrears_status, project_title, project_description, technologies, 
        internship_experience, internship_details, preferred_role, 
        preferred_location, expected_salary, resume_path, availability, 
        declaration_accepted, linkedin_profile, github_profile, 
        portfolio_website, primary_skills, tools_technologies, 
        certifications, skill_level
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
        $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
      ) RETURNING *`;

        const values = [
            registrationId, data.full_name, data.email, data.mobile, data.gender, data.dob,
            data.current_city, data.current_state, data.willing_to_relocate, data.college_name,
            data.department, data.degree, data.yop, data.current_cgpa, data.tenth_percent,
            data.twelfth_percent, data.ug_cgpa, data.current_arrears, data.history_arrears,
            data.arrears_status, data.project_title, data.project_description, data.technologies,
            data.internship_experience, data.internship_details, data.preferred_role,
            data.preferred_location, data.expected_salary, data.resume_path, data.availability,
            data.declaration_accepted, data.linkedin_profile, data.github_profile,
            data.portfolio_website, data.primary_skills, data.tools_technologies,
            data.certifications, data.skill_level
        ];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM registrations';
        const values = [];
        const filterClauses = [];

        if (filters.department) {
            values.push(filters.department);
            filterClauses.push(`department ILIKE $${values.length}`);
        }
        if (filters.cgpa) {
            values.push(filters.cgpa);
            filterClauses.push(`current_cgpa >= $${values.length}`);
        }
        if (filters.yop) {
            values.push(filters.yop);
            filterClauses.push(`yop = $${values.length}`);
        }
        if (filters.search) {
            values.push(`%${filters.search}%`);
            filterClauses.push(`(full_name ILIKE $${values.length} OR registration_id ILIKE $${values.length} OR email ILIKE $${values.length})`);
        }

        if (filterClauses.length > 0) {
            query += ' WHERE ' + filterClauses.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';
        const { rows } = await db.query(query, values);
        return rows;
    }
}

module.exports = Registration;
