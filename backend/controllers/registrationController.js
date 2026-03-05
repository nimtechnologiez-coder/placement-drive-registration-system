const Registration = require('../models/registration');
const { sendConfirmationEmail } = require('../config/email');
const supabase = require('../config/supabase');
const XLSX = require('xlsx');
const path = require('path');

exports.registerStudent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Resume is mandatory' });
        }

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return res.status(500).json({ success: false, message: 'Failed to upload resume to cloud storage' });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);

        const data = {
            ...req.body,
            resume_path: publicUrl,
            internship_details: req.body.internship_details ? JSON.parse(req.body.internship_details) : null,
            willing_to_relocate: req.body.willing_to_relocate === 'true' || req.body.willing_to_relocate === true,
            current_arrears: req.body.current_arrears === 'true' || req.body.current_arrears === true,
            declaration_accepted: req.body.declaration_accepted === 'true' || req.body.declaration_accepted === true
        };

        const student = await Registration.create(data);

        // Asynchronous email sending
        sendConfirmationEmail(student).catch(err => console.error('Email failed:', err));

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                registration_id: student.registration_id,
                full_name: student.full_name
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        const { department, cgpa, yop, search } = req.query;
        const registrations = await Registration.findAll({ department, cgpa, yop, search });
        res.status(200).json({ success: true, data: registrations });
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

exports.exportToExcel = async (req, res) => {
    try {
        const registrations = await Registration.findAll(req.query);
        const flattenedData = registrations.map(reg => ({
            'Registration ID': reg.registration_id,
            'Full Name': reg.full_name,
            'Email': reg.email,
            'Mobile': reg.mobile,
            'Gender': reg.gender,
            'DOB': reg.dob,
            'City': reg.current_city,
            'State': reg.current_state,
            'Relocate': reg.willing_to_relocate ? 'Yes' : 'No',
            'College': reg.college_name,
            'Department': reg.department,
            'Degree': reg.degree,
            'YOP': reg.yop,
            'CGPA': reg.current_cgpa,
            '10th %': reg.tenth_percent,
            '12th %': reg.twelfth_percent,
            'History of Arrears': reg.history_arrears,
            'Project Title': reg.project_title,
            'Preferred Role': reg.preferred_role,
            'Availability': reg.availability,
            'LinkedIn': reg.linkedin_profile,
            'GitHub': reg.github_profile,
            'Portfolio': reg.portfolio_website,
            'Primary Skills': reg.primary_skills,
            'Tools Known': reg.tools_technologies,
            'Certifications': reg.certifications,
            'Skill Level': reg.skill_level,
            'Resume Link': reg.resume_path,
            'Created At': reg.created_at
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(flattenedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=placement_registrations.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ success: false, message: 'Error exporting data' });
    }
};
